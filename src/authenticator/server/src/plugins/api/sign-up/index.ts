import trim from "lodash-es/trim"
import { isEmpty } from "lodash-es"
import multiPart from "@fastify/multipart"
import { readFile } from "node:fs/promises"
import { FastifyPluginAsync } from "fastify"
import { UserBase } from "@oly_op/musicloud-common/build/types"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"

import saveToAlgolia from "./save-to-algolia"
import { hashPassword } from "./hash-password"
import passwordSchema from "./password-schema"
import { isPartFile, Part, Body, Route } from "./types"
import { createJWT, emailAddressExists } from "../helpers"
import { coverImages, profileImages } from "./image-inputs"
import { determineCover, determineProfile } from "./determine-images"
import { normalizeImageAndUploadToS3 } from "./normalize-image-and-upload-to-s3"

const INSERT_USER =
	(await readFile(new URL("./insert-user.sql", import.meta.url))).toString()

export const signUp: FastifyPluginAsync =
	async fastify => {
		await fastify.register(multiPart, {
			limits: {
				fileSize: 15 * 1000000, // 15 MB
			},
		})

		fastify.post<Route>(
			"/sign-up",
			async request => {
				const body = {} as Body

				const parts =
					request.parts() as AsyncIterableIterator<Part>

				for await (const part of parts) {
					if (isPartFile(part)) {
						if (part.value && part.value === "null") {
							body[part.fieldname] = null
						} else {
							body[part.fieldname] = await part.toBuffer()
						}
					} else {
						body[part.fieldname] = part.value
					}
				}

				const emailAddress =
					trim(body.emailAddress)

				const doesUserExist =
					await emailAddressExists(fastify.pg.pool)({ emailAddress })

				if (doesUserExist) {
					throw new Error("Email address already exists")
				}

				const passwordValidation =
					passwordSchema.validate(body.password, { list: true })

				if (Array.isArray(passwordValidation) && !isEmpty(passwordValidation)) {
					throw new Error(`Password validation failed: ${passwordValidation.toString()}`)
				}

				const name =
					trim(body.name)

				const password =
					await hashPassword({
						password: body.password,
					})

				const user =
					await query(fastify.pg.pool)(INSERT_USER)({
						parse: convertFirstRowToCamelCase<UserBase>(),
						variables: [{
							value: "*",
							key: "columnNames",
						},{
							key: "name",
							value: name,
							parameterized: true,
						},{
							key: "password",
							value: password,
							parameterized: true,
						},{
							key: "emailAddress",
							value: emailAddress,
							parameterized: true,
						}],
					})

				const { userID } = user

				const cover =
					await determineCover({
						cover: body.cover,
					})

				const profile =
					await determineProfile({
						profile: body.profile,
					})

				await normalizeImageAndUploadToS3(fastify.s3)({
					buffer: cover,
					objectID: userID,
					images: coverImages,
				})

				await normalizeImageAndUploadToS3(fastify.s3)({
					buffer: profile,
					objectID: userID,
					images: profileImages,
				})

				await saveToAlgolia(fastify.ag.index)({
					name,
					userID,
					emailAddress,
					image: profileImages[2]!,
				})

				const accessToken =
					await createJWT(fastify.ag.client)(user)

				return {
					accessToken,
				}
			},
		)
	}