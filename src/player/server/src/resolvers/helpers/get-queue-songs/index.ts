import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCaseOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Song, TableNameOptions } from "../../../types/index.js";

const SELECT_QUEUE_SONGS = await importSQL(import.meta.url)("select-queue-songs-with-index");

export interface GetQueueSongsOptions extends UserID, TableNameOptions {
	limit?: number;
}

interface SongWithQueueIndex extends Song {
	queueIndex: number;
}

export const getQueueSongs =
	(pg: PoolOrClient) =>
	({ limit, userID, tableName }: GetQueueSongsOptions) =>
		query(pg)(SELECT_QUEUE_SONGS)({
			parse: convertTableToCamelCaseOrNull<SongWithQueueIndex>(),
			variables: {
				userID,
				tableName: [tableName],
				limit: [limit || "ALL"],
				columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			},
		});
