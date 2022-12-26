import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, getResultExists, importSQL, query } from "@oly_op/pg-helpers";

import { IndexOptions, TableNameOptions } from "../../../types/index.js";

const EXISTS_QUEUE_SONG = await importSQL(import.meta.url)("exists-queue-song");

export const existsQueueSong =
	(pg: PoolOrClient) =>
	async ({ userID, index, tableName }: Options) => {
		const result = await query(pg)(EXISTS_QUEUE_SONG)({
			parse: getResultExists,
			variables: {
				userID,
				index,
				tableName: [tableName],
			},
		});

		return result;
	};

interface Options extends UserID, IndexOptions, TableNameOptions {}
