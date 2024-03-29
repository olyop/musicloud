import { SongID, UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";

import { IndexOptions, TableNameOptions } from "../../../types/index.js";

const INSERT_QUEUE_SONG = await importSQL(import.meta.url)("insert-queue-song");

export const insertQueueSong =
	(client: PoolOrClient) =>
	({ index, songID, userID, tableName }: Options) =>
		query(client)(INSERT_QUEUE_SONG)({
			variables: {
				index,
				userID,
				songID,
				tableName: [tableName],
			},
		});

interface Options extends IndexOptions, UserID, SongID, TableNameOptions {}
