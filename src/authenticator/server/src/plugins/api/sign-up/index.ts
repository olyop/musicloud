import multiPart from "@fastify/multipart";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserBase } from "@oly_op/musicloud-common/build/types";
import { addPrefix, convertFirstRowToCamelCase, importSQL, query } from "@oly_op/pg-helpers";
import bytes from "bytes";
import { FastifyPluginAsync } from "fastify";
import { isString, trim } from "lodash-es";

import { createJWT, emailAddressExists, hashPassword, isPasswordValid } from "../helpers/index.js";
import { determineCover, determineProfile } from "./determine-images.js";
import { coverImages, profileImages } from "./image-inputs.js";
import { normalizeImageAndUploadToS3 } from "./normalize-image-and-upload-to-s3.js";
import saveToAlgolia from "./save-to-algolia.js";
import { Body, Part, Route, isPartFile } from "./types.js";

const INSERT_USER = await importSQL(import.meta.url)("insert-user");

export const signUp: FastifyPluginAsync = async fastify => {
	await fastify.register(multiPart, {
		limits: {
			fileSize: bytes("15mb"),
		},
	});

	fastify.post<Route>("/sign-up", async request => {
		const body = {} as Body;

		const parts = request.parts() as AsyncIterableIterator<Part>;

		for await (const part of parts) {
			if (isPartFile(part)) {
				if (part.value && part.value === "null") {
					body[part.fieldname] = null;
				} else {
					body[part.fieldname] = await part.toBuffer();
				}
			} else {
				body[part.fieldname] = part.value;
			}
		}

		const emailAddress = trim(body.emailAddress);

		const doesUserExist = await emailAddressExists(fastify.pg.pool)({ emailAddress });
		if (doesUserExist) {
			throw new Error("Email address already exists");
		}

		const passwordValidationResult = isPasswordValid(body.password);
		if (isString(passwordValidationResult)) {
			throw new Error(passwordValidationResult);
		}

		const name = trim(body.name);

		const passwordHash = await hashPassword(body.password);

		const user = await query(fastify.pg.pool)(INSERT_USER)({
			parse: convertFirstRowToCamelCase<UserBase>(),
			variables: {
				name: [name, [true]],
				password: [passwordHash, [true]],
				emailAddress: [emailAddress, [true]],
				columnNames: addPrefix(COLUMN_NAMES.USER),
			},
		});

		const { userID } = user;

		const cover = await determineCover({
			cover: body.cover,
		});

		const profile = await determineProfile({
			profile: body.profile,
		});

		await normalizeImageAndUploadToS3(fastify.s3)({
			buffer: cover,
			objectID: userID,
			images: coverImages,
		});

		await normalizeImageAndUploadToS3(fastify.s3)({
			buffer: profile,
			objectID: userID,
			images: profileImages,
		});

		await saveToAlgolia(fastify.ag.index)({
			name,
			userID,
			emailAddress,
			image: profileImages[2]!,
		});

		const accessToken = await createJWT(fastify.ag.client)(user);

		return {
			accessToken,
		};
	});
};
