import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCaseOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { QueueSong, TableNameOptions } from "../../../types/index.js";

const SELECT_QUEUE = await importSQL(import.meta.url)("select-queue");

export interface GetQueueOptions extends UserID, TableNameOptions {}

export const getQueueSection =
	(pg: PoolOrClient) =>
	({ userID, tableName }: GetQueueOptions) =>
		query(pg)(SELECT_QUEUE)({
			parse: convertTableToCamelCaseOrNull<QueueSong>(),
			variables: {
				userID,
				tableName: [tableName],
				columnNames: addPrefix(COLUMN_NAMES.QUEUE_SONG),
			},
		});
