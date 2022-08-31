import {
	join,
	exists,
	VariableInput,
	getResultExists,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { Pool } from "pg"
import { UserID, ObjectID, ObjectTypeNames } from "@oly_op/musicloud-common/build/types"

import {
	INSERT_LIBRARY_OBJECT,
	EXISTS_LIBRARY_OBJECT,
	UPDATE_OBJECT_IN_LIBRARY,
} from "../../sql"

export interface HandleInLibraryOptions
	extends UserID, ObjectID {
	inLibrary: boolean,
	returnQuery: string,
	columnNames: readonly string[],
	tableName: "songs" | "artists" | "playlists",
	columnKey: "songID" | "artistID" | "playlistID",
	columnName: "song_id" | "artist_id" | "playlist_id",
	typeName: Extract<ObjectTypeNames, "Song" | "Artist" | "Playlist">,
	libraryTableName: "library_songs" | "library_artists" | "library_playlists",
}

export const handleInLibrary =
	(pool: Pool) =>
		async <T>(options: HandleInLibraryOptions) => {
			const {
				userID,
				objectID,
				typeName,
				columnKey,
				inLibrary,
				tableName,
				columnName,
				columnNames,
				returnQuery,
				libraryTableName,
			} = options

			const client = await pool.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const doesObjectExist =
					await exists(client)({
						value: objectID,
						table: tableName,
						column: columnName,
					})

				if (!doesObjectExist) {
					throw new Error(`${typeName} ${objectID} does not exist`)
				}

				const variables: VariableInput = {
					userID,
					objectID,
					columnName,
					tableName: libraryTableName,
				}

				const doesLibraryObjectExist =
					await query(EXISTS_LIBRARY_OBJECT)({
						variables,
						parse: getResultExists,
					})

				if (doesLibraryObjectExist) {
					await query(UPDATE_OBJECT_IN_LIBRARY)({
						variables: {
							...variables,
							inLibrary,
						},
					})
				} else {
					await query(INSERT_LIBRARY_OBJECT)({
						variables: {
							...variables,
							inLibrary,
						},
					})
				}

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return query(returnQuery)({
				parse: convertFirstRowToCamelCase<T>(),
				variables: {
					[columnKey]: objectID,
					columnNames: join(columnNames),
				},
			})
		}