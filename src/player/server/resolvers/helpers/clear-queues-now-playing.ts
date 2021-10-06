import { PoolOrClient } from "@oly_op/pg-helpers"

import { clearQueues } from "./clear-queues"
import { clearUserNowPlaying } from "./clear-user-now-playing"

export const clearQueuesNowPlaying =
	(client: PoolOrClient) =>
		async (userID: string) => {
			await clearQueues(client)(userID)
			await clearUserNowPlaying(client)(userID)
		}