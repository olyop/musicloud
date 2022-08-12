import { trim } from "lodash-es"
import { FastifyPluginAsync } from "fastify"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"
import { ArtistID, AlgoliaRecordArtist } from "@oly_op/musicloud-common/build/types"

import { Route } from "./types"
import { DELETE_ARTIST, INSERT_ARTIST } from "./sql"
import { coverImageInputs, profileImageInputs } from "./images-inputs"
import { addRecordToSearchIndex, determineCatalogImageURL, normalizeImageAndUploadToS3 } from "../helpers"

export const uploadArtist: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>(
			"/artist",
			async (request, reply) => {
				const { body } = request
				const name = trim(body.name)
				const cover = body.cover[0]!.data
				const profile = body.profile[0]!.data
				const city = body.city ? trim(body.city) : null
				const country = body.country ? trim(body.country) : null

				try {
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

					await normalizeImageAndUploadToS3(fastify.s3)({
						buffer: cover,
						objectID: artistID,
						images: coverImageInputs,
					})

					await normalizeImageAndUploadToS3(fastify.s3)({
						buffer: profile,
						objectID: artistID,
						images: profileImageInputs,
					})

					await addRecordToSearchIndex(fastify.ag.index)<AlgoliaRecordArtist>({
						name,
						plays: 0,
						typeName: "Artist",
						objectID: artistID,
						image: determineCatalogImageURL(artistID, profileImageInputs[2]!),
						...(city && country ? { city, country } : {}),
					})

					void reply.code(201)

					return { artistID	}
				} catch (error) {
					await query(fastify.pg.pool)(DELETE_ARTIST)({
						variables: [{
							key: "name",
							value: name,
							parameterized: true,
						}],
					})

					void reply.code(500)

					return "Not Created"
				}
			},
		)
	}