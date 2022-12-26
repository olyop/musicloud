import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";

import { IndexOptions, TableNameOptions } from "../../../types/index.js";

const isf = importSQL(import.meta.url);

const UPDATE_QUEUE_SONG_CREMENT_INDEX = await isf("update-queue-song-crement-index");

export const crementQueueSongIndex =
	(pg: PoolOrClient) =>
	(increment: boolean, { userID, index, tableName }: Options) =>
		query(pg)(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
			variables: {
				index,
				userID,
				tableName: [tableName],
				crement: [increment ? "+" : "-"],
			},
		});

interface Options extends UserID, TableNameOptions, IndexOptions {}
