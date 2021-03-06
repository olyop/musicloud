import { UserID } from "@oly_op/musicloud-common"
import { query, PoolOrClient } from "@oly_op/pg-helpers"

import { DELETE_QUEUE_BY_USER } from "../../sql"

export const clearQueuePrevious =
	(pg: PoolOrClient) =>
		({ userID }: UserID) =>
			query(pg)(DELETE_QUEUE_BY_USER)({
				variables: {
					userID,
					tableName: "queue_previous",
				},
			})