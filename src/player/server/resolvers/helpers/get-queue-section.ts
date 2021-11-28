import { UserIDBase } from "@oly_op/music-app-common/types"

import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { SELECT_QUEUE } from "../../sql"
import { COLUMN_NAMES } from "../../globals"
import { QueueSong, TableNameOptions } from "../../types"

export interface GetQueueOptions
	extends UserIDBase, TableNameOptions {}

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
			})