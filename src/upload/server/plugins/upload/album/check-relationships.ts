import { Pool } from "pg"
import { trim } from "lodash"
import createError from "fastify-error"
import { exists } from "@oly_op/pg-helpers"

import { List, Song } from "./types"

const ExistsError =
	createError(
		"FST_ERR_CTP_INVALID_TYPE",
		"%s %s does not exist",
	)

const checkRelationships =
	(pg: Pool) =>
		async (albumArtists: List, songs: Song[]) => {
			for (const albumArtist of albumArtists) {
				const artistExists =
					await exists(pg)({
						column: "name",
						table: "artists",
						value: trim(albumArtist.value),
					})
				if (!artistExists) {
					throw new ExistsError("Artist", albumArtist.value)
				}
			}
			for (const song of songs) {
				for (const genre of song.genres) {
					const genreExists =
						await exists(pg)({
							column: "name",
							table: "genres",
							value: trim(genre.value),
						})
					if (!genreExists) {
						throw new ExistsError("Genre", genre.value)
					}
				}
				for (const artist of song.artists) {
					const artistExists =
						await exists(pg)({
							column: "name",
							table: "artists",
							value: trim(artist.value),
						})
					if (!artistExists) {
						throw new ExistsError("Artist", artist.value)
					}
				}
				for (const remixer of song.remixers) {
					const remixerExists =
						await exists(pg)({
							column: "name",
							table: "artists",
							value: trim(remixer.value),
						})
					if (!remixerExists) {
						throw new ExistsError("Artist", remixer.value)
					}
				}
				for (const feature of song.featuring) {
					const featureExists =
						await exists(pg)({
							column: "name",
							table: "artists",
							value: trim(feature.value),
						})
					if (!featureExists) {
						throw new ExistsError("Artist", feature.value)
					}
				}
			}
		}

export default checkRelationships