import { query, PoolOrClient } from "@oly_op/pg-helpers"
import { UserIDBase } from "@oly_op/music-app-common/types"

import { DELETE_QUEUE_BY_USER } from "../../sql"

export const clearQueuePrevious =
	(client: PoolOrClient) =>
		({ userID }: UserIDBase) =>
			query(client)(DELETE_QUEUE_BY_USER)({
				variables: {
					userID,
					tableName: "queue_previous",
				},
			})