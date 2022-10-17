import { UserID } from "@oly_op/musicloud-common/build/types";

import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { join, query, PoolOrClient, convertTableToCamelCaseOrNull } from "@oly_op/pg-helpers";

import { SELECT_QUEUE } from "../../sql";
import { QueueSong, TableNameOptions } from "../../types";

export interface GetQueueOptions extends UserID, TableNameOptions {}

export const getQueueSection =
	(client: PoolOrClient) =>
	({ userID, tableName }: GetQueueOptions) =>
		query(client)(SELECT_QUEUE)({
			parse: convertTableToCamelCaseOrNull<QueueSong>(),
			variables: {
				userID,
				tableName,
				columnNames: join(COLUMN_NAMES.QUEUE_SONG),
			},
		});
