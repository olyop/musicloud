import { join } from "path"
import { readFileSync } from "fs"
import { v4 as createUUID } from "uuid"
import { BodyEntry } from "fastify-multipart"
import { FastifyPluginCallback } from "fastify"
import { query, exists } from "@oly_op/pg-helpers"
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
		city: string,
		country: string,
		cover: BodyEntry[],
		profile: BodyEntry[],
	},
}

const coverImages: ImageInput[] = [{
	name: "cover",
	size: ImageSizes.MINI,
	dimension: ImageDimensions.SQUARE,
},{
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

const INSERT_ARTIST =
	readFileSync(join(UPLOAD_PLUGINS_PATH, "artist", "insert.sql")).toString()

export const uploadArtist: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/artist",
			async (request, reply) => {
				const artistID = createUUID()
				const cover = request.body.cover[0].data
				const profile = request.body.profile[0].data
				const { name, city, country } = request.body

				const doesArtistAlreadyExist =
					await exists(fastify.pg.pool)({
						value: name,
						column: "name",
						table: "artists",
					})

				if (doesArtistAlreadyExist) {
					throw new Error("Artist already exists")
				}

				await normalizeImageAndUploadToS3({
					buffer: cover,
					objectID: artistID,
					images: coverImages,
				})

				await normalizeImageAndUploadToS3({
					buffer: profile,
					objectID: artistID,
					images: profileImages,
				})

				await addIndexToAlgolia({
					text: name,
					typeName: "Artist",
					objectID: artistID,
					image: determineS3ImageURL(artistID, profileImages[2]),
				})

				await query(fastify.pg.pool)(INSERT_ARTIST)({
					variables: [{
						key: "artistID",
						value: artistID,
					},{
						key: "name",
						value: name,
						parameterized: true,
					},{
						key: "city",
						value: city,
						parameterized: true,
					},{
						key: "country",
						value: country,
						parameterized: true,
					}],
				})

				return reply.send()
			},
		)
		done()
	}