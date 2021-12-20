import { SearchIndex } from "algoliasearch"
import { ArtistID, SongID } from "@oly_op/music-app-common/types"
import { convertTableToCamelCase, PoolOrClient, query } from "@oly_op/pg-helpers"

import {
	SELECT_SONG_ARTISTS,
	SELECT_SONG_REMIXERS,
	SELECT_SONG_FEATURING,
} from "../../../sql"

import { getSong } from "../get-objects"
import { COLUMN_NAMES } from "../../../globals"

const incrementPlays =
	(pg: PoolOrClient, ag: SearchIndex) =>
		async ({ songID }: SongID) => {
			await ag.partialUpdateObject({
				objectID: songID,
				plays: {
					value: 1,
					_operation: "Increment",
				},
			})

			const { albumID } =
				await getSong(pg)({ songID })

			await ag.partialUpdateObject({
				objectID: albumID,
				plays: {
					value: 1,
					_operation: "Increment",
				},
			})

			const songArtists =
				await query(pg)(SELECT_SONG_ARTISTS)({
					parse: convertTableToCamelCase<ArtistID>(),
					variables: {
						songID,
						columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
					},
				})

			const songRemixers =
				await query(pg)(SELECT_SONG_REMIXERS)({
					parse: convertTableToCamelCase<ArtistID>(),
					variables: {
						songID,
						columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
					},
				})

			const songFeaturing =
				await query(pg)(SELECT_SONG_FEATURING)({
					parse: convertTableToCamelCase<ArtistID>(),
					variables: {
						songID,
						columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
					},
				})

			const artists = [
				...songArtists,
				...songRemixers,
				...songFeaturing,
			]

			for (const artist of artists) {
				await ag.partialUpdateObject({
					objectID: artist.artistID,
					plays: {
						value: 1,
						_operation: "Increment",
					},
				})
			}
		}

export default incrementPlays