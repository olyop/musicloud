import { query, PoolOrClient } from "@oly_op/pg-helpers"
import { UserID } from "@oly_op/musicloud-common/build/types"

import { DELETE_QUEUE_BY_USER } from "../../sql"

export const clearQueueLater =
	(client: PoolOrClient) =>
		({ userID }: UserID) =>
			query(client)(DELETE_QUEUE_BY_USER)({
				variables: {
					userID,
					tableName: "queue_laters",
				},
			})