import bcrypt from "bcrypt"
import { join } from "path"
import { readFileSync } from "fs"
import { v4 as createUUID } from "uuid"
import { query } from "@oly_op/pg-helpers"
import { BodyEntry } from "fastify-multipart"
import { FastifyPluginCallback } from "fastify"
import { ImageInput, ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import {
	addIndexToAlgolia,
	determineS3ImageURL,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface Route {
	Body: {
		name: string,
		password: string,
		cover: BodyEntry[],
		profile: BodyEntry[],
	},
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
				const userID = createUUID()
				const { name } = request.body
				const cover = request.body.cover[0].data
				const profile = request.body.profile[0].data
				const password = await bcrypt.hash(request.body.password, 12)

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

				await addIndexToAlgolia({
					text: name,
					typeName: "User",
					objectID: userID,
					image: determineS3ImageURL(userID, profileImages[2]),
				})

				await query(fastify.pg.pool)(INSERT_USER)({
					variables: [{
						key: "userID",
						value: userID,
					},{
						key: "name",
						value: name,
						parameterized: true,
					},{
						key: "password",
						value: password,
						parameterized: true,
					}],
				})

				return reply.send()
			},
		)
		done()
	}