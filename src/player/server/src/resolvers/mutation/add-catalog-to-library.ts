import { query, convertTableToCamelCase, join } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Artist, Song } from "../../types"
import { handleInLibrary } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_SONGS, SELECT_ARTISTS, SELECT_ARTIST_BY_ID, SELECT_SONG_BY_ID } from "../../sql"

export const addCatalogToLibrary =
	resolver(
		async ({ context }) => {
			const { userID } =
				context.getAuthorizationJWTPayload(context.authorization)

			const songs =
				await query(context.pg)(SELECT_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			const artists =
				await query(context.pg)(SELECT_ARTISTS)({
					parse: convertTableToCamelCase<Artist>(),
					variables: {
						columnNames: join(COLUMN_NAMES.ARTIST),
					},
				})

			for (const { songID } of songs) {
				await handleInLibrary(context.pg)({
					userID,
					inLibrary: true,
					typeName: "Song",
					objectID: songID,
					tableName: "songs",
					columnKey: "songID",
					columnNames: COLUMN_NAMES.SONG,
					returnQuery: SELECT_SONG_BY_ID,
					columnName: COLUMN_NAMES.SONG[0],
					libraryTableName: "library_songs",
				})
			}

			for (const { artistID } of artists) {
				await handleInLibrary(context.pg)({
					userID,
					inLibrary: true,
					typeName: "Artist",
					objectID: artistID,
					tableName: "artists",
					columnKey: "artistID",
					columnNames: COLUMN_NAMES.ARTIST,
					returnQuery: SELECT_ARTIST_BY_ID,
					columnName: COLUMN_NAMES.ARTIST[0],
					libraryTableName: "library_artists",
				})
			}
		},
	)