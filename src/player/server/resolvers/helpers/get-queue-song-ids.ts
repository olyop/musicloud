import { PoolOrClient } from "@oly_op/pg-helpers"

import { getQueue } from "./get-queue"

export const getQueueSongIDs =
	(client: PoolOrClient) =>
		(userID: string) =>
			async (tableName: string) => {
				const queue = await getQueue(client)(userID)(tableName)
				return queue.map(({ songID }) => songID)
			}