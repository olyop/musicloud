import { ObjectID, UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

const isf = importSQL(import.meta.url);

const SELECT_OBJECT_BY_ID = await isf("select-object-by-id");
const EXECUTE_HANDLE_IN_LIBRARY = await isf("execute-handle-in-library");

export const handleInLibrary =
	(pg: PoolOrClient) =>
	async <T>(options: HandleInLibraryOptions) => {
		const { userID, objectID, inLibrary, columnNames, typeName, tableName, columnName } = options;

		await query(pg)(EXECUTE_HANDLE_IN_LIBRARY)({
			variables: {
				userID,
				objectID,
				inLibrary,
				typeName: [typeName],
			},
		});

		return query(pg)(SELECT_OBJECT_BY_ID)({
			parse: convertFirstRowToCamelCase<T>(),
			variables: {
				objectID,
				tableName: [tableName],
				columnName: [columnName],
				columnNames: addPrefix(columnNames, tableName),
			},
		});
	};

export interface HandleInLibraryOptions extends UserID, ObjectID {
	inLibrary: boolean;
	columnNames: readonly string[];
	typeName: "song" | "artist" | "playlist";
	tableName: "songs" | "artists" | "playlists";
	columnName: "song_id" | "artist_id" | "playlist_id";
}
