import { join, query, PoolOrClient, convertTableToCamelCaseOrNull } from "@oly_op/pg-helpers";

import { pipe } from "rxjs";
import { UserID } from "@oly_op/musicloud-common/build/types";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";

import { SELECT_QUEUE_SONGS } from "../../sql";
import { Song, TableNameOptions } from "../../types";

export const addQueueIndexToSongs = (songs: Song[] | null) =>
	songs &&
	songs.map<Song>((song, queueIndex) => ({
		...song,
		queueIndex,
	}));

export interface GetQueueSongsOptions extends UserID, TableNameOptions {
	limit?: number;
}

export const getQueueSongs =
	(pg: PoolOrClient) =>
	({ limit, userID, tableName }: GetQueueSongsOptions) =>
		query(pg)(SELECT_QUEUE_SONGS)({
			parse: pipe(convertTableToCamelCaseOrNull<Song>(), addQueueIndexToSongs),
			variables: {
				userID,
				tableName,
				limit: limit || "ALL",
				columnNames: join(COLUMN_NAMES.SONG, "songs"),
			},
		});
