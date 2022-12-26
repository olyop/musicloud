import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";

import { IndexOptions, TableNameOptions } from "../../../types/index.js";

const DELETE_QUEUE_SONG = await importSQL(import.meta.url)("delete-queue-song");

export const deleteQueueSong =
	(pg: PoolOrClient) =>
	({ userID, index, tableName }: Options) =>
		query(pg)(DELETE_QUEUE_SONG)({
			variables: {
				index,
				userID,
				tableName: [tableName],
			},
		});

interface Options extends UserID, IndexOptions, TableNameOptions {}
