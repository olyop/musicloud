import { join } from "path"
import { trim } from "lodash-es"
import { readFileSync } from "fs"
import { FastifyPluginCallback } from "fastify"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"
import { ImageDimensions, ImageSizes, ArtistBase, ArtistID, AlgoliaRecordArtist } from "@oly_op/musicloud-common"

import {
	addRecordToSearchIndex,
	determineCatalogImageURL,
	normalizeImageAndUploadToS3,
} from "../helpers"

import { BodyEntry, ImageInput } from "../types"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface Artist extends Omit<ArtistBase, "artistID"> {
	city?: string,
	country?: string,
	cover: BodyEntry[],
	profile: BodyEntry[],
}

interface Route {
	Body: Artist,
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
	(fastify, _, done) => {
		fastify.post<Route>(
			"/upload/artist",
			async (request, reply) => {
				const { body } = request
				const name = trim(body.name)
				const cover = body.cover[0]!.data
				const profile = body.profile[0]!.data
				const city = body.city && trim(body.city)
				const country = body.country && trim(body.country)

				const doesArtistAlreadyExist =
					await exists(fastify.pg.pool)({
						value: name,
						column: "name",
						table: "artists",
					})

				if (doesArtistAlreadyExist) {
					throw new Error("Artist already exists")
				}

				const { artistID } =
					await query(fastify.pg.pool)(INSERT_ARTIST)({
						parse: convertFirstRowToCamelCase<ArtistID>(),
						variables: [{
							key: "name",
							value: name,
							parameterized: true,
						}, ...(city && country ? [{
							key: "city",
							value: city,
							parameterized: true,
						},{
							key: "country",
							value: country,
							parameterized: true,
						}] : [])],
					})

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

				await addRecordToSearchIndex<AlgoliaRecordArtist>({
					name,
					plays: 0,
					typeName: "Artist",
					objectID: artistID,
					image: determineCatalogImageURL(artistID, profileImages[2]!),
					...(city && country ? { city, country } : {}),
				})

				return reply.send()
			},
		)
		done()
	}