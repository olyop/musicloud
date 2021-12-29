import bcrypt from "bcrypt"
import { join } from "path"
import { trim } from "lodash"
import { readFileSync } from "fs"
import { FastifyPluginCallback } from "fastify"
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"
import { AlgoliaRecordUser, ImageDimensions, ImageSizes, UserID } from "@oly_op/music-app-common/types"

import {
	determineS3ImageURL,
	addRecordToSearchIndex,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { Route } from "./types"
import { ImageInput } from "../types"
import { getCover, getProfile } from "./get-images"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

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
	(server, _, done) => {
		server.post<Route>(
			"/upload/user",
			async (request, reply) => {
				const name =
					trim(request.body.name)

				const password =
					await bcrypt.hash(request.body.password, 12)

				const cover =
					await getCover({ name, cover: request.body.cover })

				const profile =
					await getProfile({ name, profile: request.body.profile })

				const { userID } =
					await query(server.pg.pool)(INSERT_USER)({
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

				await addRecordToSearchIndex<AlgoliaRecordUser>({
					name,
					followers: 0,
					typeName: "User",
					objectID: userID,
					image: determineS3ImageURL(userID, profileImages[2]!),
				})

				return reply.send()
			},
		)
		done()
	}