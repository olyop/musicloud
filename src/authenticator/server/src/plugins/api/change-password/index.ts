import { importSQL, query } from "@oly_op/pg-helpers";
import { FastifyPluginAsync } from "fastify";
import { isString } from "lodash-es";

import {
	createJWT,
	emailAddressExists,
	getUserByEmailAddress,
	getUserPassword,
	hashPassword,
	isPasswordCorrect,
	isPasswordValid,
} from "../helpers/index.js";
import options from "./options.js";
import { Route } from "./types.js";

const UPDATE_USER_PASSWORD = await importSQL(import.meta.url)("update-user-password");

export const changePassword: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>("/change-password", options, async request => {
			const { emailAddress, currentPassword, newPassword } = request.body;

			const doesEmailAddressExists = await emailAddressExists(fastify.pg.pool)({ emailAddress });

			if (doesEmailAddressExists) {
				const user = await getUserByEmailAddress(fastify.pg.pool)({ emailAddress });

				const { userID } = user;

				const hashedPassword = await getUserPassword(fastify.pg.pool)({ userID });

				if (await isPasswordCorrect(currentPassword, hashedPassword)) {
					try {
						const passwordValidationResult = isPasswordValid(newPassword);

						if (isString(passwordValidationResult)) {
							throw new Error(passwordValidationResult);
						}

						const passwordHash = await hashPassword(newPassword);

						await query(fastify.pg.pool)(UPDATE_USER_PASSWORD)({
							variables: {
								userID,
								password: [passwordHash, [true]],
							},
						});

						return {
							accessToken: await createJWT(fastify.ag.client)(user),
						};
					} catch (error) {
						throw new Error(
							`Error changing password: ${
								error instanceof Error ? error.message : "Unknown Error"
							}`,
						);
					}
				} else {
					throw new Error("Password is incorrect");
				}
			} else {
				throw new Error("Email Address does not exist");
			}
		});
	};
