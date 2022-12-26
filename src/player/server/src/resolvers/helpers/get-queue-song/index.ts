import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { IndexOptions, QueueSong, TableNameOptions } from "../../../types/index.js";

const SELECT_QUEUE_SONG = await importSQL(import.meta.url)("select-queue-song");

export const getQueueSong =
	(pg: PoolOrClient) =>
	({ userID, index, tableName }: Options) =>
		query(pg)(SELECT_QUEUE_SONG)({
			parse: convertFirstRowToCamelCase<QueueSong>(),
			variables: {
				index,
				userID,
				tableName: [tableName],
				columnNames: addPrefix(COLUMN_NAMES.QUEUE_SONG),
			},
		});

interface Options extends UserID, IndexOptions, TableNameOptions {}
