import bcrypt from "bcrypt"
import { join } from "path"
import { trim } from "lodash"
import { readFileSync } from "fs"
import { FastifyPluginCallback } from "fastify"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"
import { ImageDimensions, ImageSizes, UserBase, UserID } from "@oly_op/music-app-common/types"

import {
	determineS3ImageURL,
	addRecordToSearchIndex,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { BodyEntry, ImageInput } from "../types"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface User extends Pick<UserBase, "name"> {
	password: string,
	cover: BodyEntry[],
	profile: BodyEntry[],
}

interface Route {
	Body: User,
}

const coverImages: ImageInput[] = [{
	name: "cover",
	size: ImageSizes.HALF,
	dimension: ImageDimensions.LANDSCAPE,
},{
	name: "cover",
	size: ImageSizes.FULL,
	dimension: ImageDimensions.LANDSCAPE,
}]

const profileImages: ImageInput[] = [{
	name: "profile",
	size: ImageSizes.MINI,
	dimension: ImageDimensions.SQUARE,
},{
	name: "profile",
	size: ImageSizes.HALF,
	dimension: ImageDimensions.SQUARE,
},{
	name: "profile",
	size: ImageSizes.FULL,
	dimension: ImageDimensions.SQUARE,
}]

const INSERT_USER =
	readFileSync(join(UPLOAD_PLUGINS_PATH, "user", "insert.sql")).toString()

export const uploadUser: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/user",
			async (request, reply) => {
				const name = trim(request.body.name)
				const cover = request.body.cover[0].data
				const profile = request.body.profile[0].data
				const password = await bcrypt.hash(request.body.password, 12)

				const { userID } =
					await query(fastify.pg.pool)(INSERT_USER)({
						parse: convertFirstRowToCamelCase<UserID>(),
						variables: [{
							key: "name",
							value: name,
							parameterized: true,
						},{
							key: "password",
							value: password,
							parameterized: true,
						}],
					})

				await normalizeImageAndUploadToS3({
					buffer: cover,
					objectID: userID,
					images: coverImages,
				})

				await normalizeImageAndUploadToS3({
					buffer: profile,
					objectID: userID,
					images: profileImages,
				})

				await addRecordToSearchIndex({
					name,
					typeName: "User",
					objectID: userID,
					image: determineS3ImageURL(userID, profileImages[2]),
				})

				return reply.send()
			},
		)
		done()
	}