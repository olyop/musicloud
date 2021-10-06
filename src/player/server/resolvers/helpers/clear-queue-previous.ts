import { query, PoolOrClient } from "@oly_op/pg-helpers"

import { DELETE_QUEUE_BY_USER } from "../../sql"

export const clearQueuePrevious =
	(client: PoolOrClient) =>
		(userID: string) =>
			query(client)(DELETE_QUEUE_BY_USER)({
				variables: {
					userID,
					tableName: "queue_previous",
				},
			})