import { query, PoolOrClient } from "@oly_op/pg-helpers"
import { UserID } from "@oly_op/musicloud-common"

import { DELETE_QUEUE_BY_USER } from "../../sql"

export const clearQueueNext =
	(client: PoolOrClient) =>
		({ userID }: UserID) =>
			query(client)(DELETE_QUEUE_BY_USER)({
				variables: {
					userID,
					tableName: "queue_nexts",
				},
			})