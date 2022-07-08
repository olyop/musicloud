/* eslint-disable @typescript-eslint/require-await */

import { trim } from "lodash-es"
import { FastifyPluginAsync } from "fastify"
import { ArtistID, AlgoliaRecordArtist } from "@oly_op/musicloud-common"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { Route } from "./types"
import { INSERT_ARTIST } from "./sql"
import { coverImageInputs, profileImageInputs } from "./images-inputs"
import { addRecordToSearchIndex, determineCatalogImageURL, normalizeImageAndUploadToS3 } from "../helpers"

export const uploadArtist: FastifyPluginAsync =
	async fastify => {
		fastify.post<Route>(
			"/api/upload/artist",
			async request => {
				const { body } = request
				const name = trim(body.name)
				const cover = body.cover[0]!.data
				const profile = body.profile[0]!.data
				const city = body.city ? trim(body.city) : null
				const country = body.country ? trim(body.country) : null

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

				await normalizeImageAndUploadToS3({
					buffer: cover,
					objectID: artistID,
					images: coverImageInputs,
				})

				await normalizeImageAndUploadToS3({
					buffer: profile,
					objectID: artistID,
					images: profileImageInputs,
				})

				await addRecordToSearchIndex<AlgoliaRecordArtist>({
					name,
					plays: 0,
					typeName: "Artist",
					objectID: artistID,
					image: determineCatalogImageURL(artistID, profileImageInputs[2]!),
					...(city && country ? { city, country } : {}),
				})

				return {
					artistID,
				}
			},
		)
	}