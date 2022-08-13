import { query, convertTableToCamelCase, join } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Song } from "../../types"
import { SELECT_SONGS } from "../../sql"
import { handleInLibrary } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

export const addCatalogToLibrary =
	resolver(
		async ({ context }) => {
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			const songs =
				await query(context.pg)(SELECT_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const { songID } of songs) {
				await handleInLibrary(context.pg)({
					userID,
					inLibrary: true,
					objectID: songID,
					tableName: "songs",
					columnKey: "songID",
					columnNames: COLUMN_NAMES.SONG,
					columnName: COLUMN_NAMES.SONG[0],
					libraryTableName: "library_songs",
				})
			}
		},
	)