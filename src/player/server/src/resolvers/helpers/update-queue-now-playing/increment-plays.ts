import { SearchIndex } from "algoliasearch"
import { ArtistID, GenreID, SongID, UserID } from "@oly_op/musicloud-common"
import { convertTableToCamelCase, PoolOrClient, query } from "@oly_op/pg-helpers"

import {
	INSERT_PLAY,
	SELECT_SONG_GENRES,
	SELECT_SONG_ARTISTS,
	SELECT_SONG_REMIXERS,
	SELECT_SONG_FEATURING,
} from "../../../sql"

import { getSong } from "../get-objects"
import { COLUMN_NAMES } from "../../../globals"

const incrementOne = {
	value: 1,
	_operation: "Increment",
}

interface IncrementPlaysOptions
	extends UserID, SongID {}

const incrementPlays =
	(pg: PoolOrClient, ag: SearchIndex) =>
		async ({ userID, songID }: IncrementPlaysOptions) => {
			const [
				{ albumID },
				genres,
				artists,
				remixers,
				featuring,
			] =
				await Promise.all([
					getSong(pg)({ songID }),
					query(pg)(SELECT_SONG_GENRES)({
						parse: convertTableToCamelCase<GenreID>(),
						variables: {
							songID,
							columnNames: `genres.${COLUMN_NAMES.GENRE[0]}`,
						},
					}),
					query(pg)(SELECT_SONG_ARTISTS)({
						parse: convertTableToCamelCase<ArtistID>(),
						variables: {
							songID,
							columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
						},
					}),
					query(pg)(SELECT_SONG_REMIXERS)({
						parse: convertTableToCamelCase<ArtistID>(),
						variables: {
							songID,
							columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
						},
					}),
					query(pg)(SELECT_SONG_FEATURING)({
						parse: convertTableToCamelCase<ArtistID>(),
						variables: {
							songID,
							columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
						},
					}),
					query(pg)(INSERT_PLAY)({
						variables: { userID, songID },
					}),
				])

			await Promise.all([
				ag.partialUpdateObject({
					objectID: albumID,
					plays: incrementOne,
				}),
				ag.partialUpdateObject({
					objectID: songID,
					plays: incrementOne,
				}),
				Promise.all(
					genres.map(
						({ genreID }) => (
							ag.partialUpdateObject({
								objectID: genreID,
								plays: incrementOne,
							})
						),
					),
				),
				Promise.all(
					[ ...artists, ...remixers, ...featuring ].map(
						({ artistID }) => (
							ag.partialUpdateObject({
								objectID: artistID,
								plays: incrementOne,
							})
						),
					),
				),
			])
		}

export default incrementPlays