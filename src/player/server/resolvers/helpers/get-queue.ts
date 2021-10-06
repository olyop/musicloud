import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { QueueSong } from "../../types"
import { SELECT_QUEUE } from "../../sql"
import { COLUMN_NAMES } from "../../globals"

export const getQueue =
	(client: PoolOrClient) =>
		(userID: string) =>
			(queueName: string) =>
				query(client)(SELECT_QUEUE)({
					parse: convertTableToCamelCase<QueueSong>(),
					variables: {
						userID,
						tableName: queueName,
						columnNames: join(COLUMN_NAMES.QUEUE_SONG),
					},
				})