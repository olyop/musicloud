import {
	join,
	query,
	exists,
	VariableInput,
	PoolOrClient,
	getResultExists,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { UserID, ObjectID, ObjectTypeNames } from "@oly_op/musicloud-common/build/types"

import {
	INSERT_LIBRARY_OBJECT,
	EXISTS_LIBRARY_OBJECT,
	UPDATE_OBJECT_IN_LIBRARY,
} from "../../sql"

const checkObjectExists =
	(pg: PoolOrClient) =>
		async ({ objectID, typeName, tableName, columnName }: HandleInLibraryOptions) => {
			const doesObjectExist =
				await exists(pg)({
					value: objectID,
					table: tableName,
					column: columnName,
				})

			if (!doesObjectExist) {
				throw new Error(`${typeName} ${objectID} does not exist`)
			}
		}

const baseHandler =
	(client: PoolOrClient) =>
		async (options: HandleInLibraryOptions) => {
			const {
				userID,
				objectID,
				inLibrary,
				columnName,
				libraryTableName,
				skipExists = false,
			} = options

			if (!skipExists) {
				await checkObjectExists(client)(options)
			}

			const variables: VariableInput = {
				userID,
				objectID,
				columnName,
				tableName: libraryTableName,
			}

			const doesLibraryObjectExist =
				await query(client)(EXISTS_LIBRARY_OBJECT)({
					variables,
					parse: getResultExists,
				})

			if (doesLibraryObjectExist) {
				await query(client)(UPDATE_OBJECT_IN_LIBRARY)({
					variables: {
						...variables,
						inLibrary,
					},
				})
			} else {
				await query(client)(INSERT_LIBRARY_OBJECT)({
					variables: {
						...variables,
						inLibrary,
					},
				})
			}
		}

const returnHandler =
	(pg: PoolOrClient) =>
		async <T>({ columnNames, columnKey, objectID, returnQuery }: HandleInLibraryOptions) => {
			if (returnQuery) {
				return query(pg)(returnQuery)({
					parse: convertFirstRowToCamelCase<T>(),
					variables: {
						[columnKey]: objectID,
						columnNames: join(columnNames),
					},
				})
			} else {
				return null
			}
		}

export const handleInLibrary =
	(pg: PoolOrClient) =>
		async <T>(options: HandleInLibraryOptions) => {
			const { useTransaction = true } = options

			if (useTransaction) {
				const client = await pg.connect()
				if (client) {
					try {
						await query(client)("BEGIN")()
						await baseHandler(client)(options)
						await query(client)("COMMIT")()
					} catch (error) {
						await query(client)("ROLLBACK")()
						throw error
					} finally {
						client.release()
					}
					return returnHandler(client)<T>(options)
				} else {
					throw new Error("Failed to load a pg client")
				}
			} else {
				await baseHandler(pg)(options)
				return returnHandler(pg)<T>(options)
			}
		}

export interface HandleInLibraryOptions
	extends UserID, ObjectID {
	inLibrary: boolean,
	skipExists?: boolean,
	returnQuery?: string,
	useTransaction?: boolean,
	columnNames: readonly string[],
	tableName: "songs" | "artists" | "playlists",
	columnKey: "songID" | "artistID" | "playlistID",
	columnName: "song_id" | "artist_id" | "playlist_id",
	typeName: Extract<ObjectTypeNames, "Song" | "Artist" | "Playlist">,
	libraryTableName: "library_songs" | "library_artists" | "library_playlists",
}