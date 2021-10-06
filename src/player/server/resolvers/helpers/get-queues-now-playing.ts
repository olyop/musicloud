import { PoolOrClient } from "@oly_op/pg-helpers"

import { getQueue } from "./get-queue"
import { QueuesNowPlaying } from "../../types"
import { getUserNowPlaying } from "./get-user-now-playing"

export const getQueuesNowPlaying =
	(client: PoolOrClient) =>
		async (userID: string): Promise<QueuesNowPlaying> => {
			const [ queuePrevious, nowPlaying, queueNext, queueLater ] =
				await Promise.all([
					getQueue(client)(userID)("queue_previous"),
					getUserNowPlaying(client)(userID),
					getQueue(client)(userID)("queue_nexts"),
					getQueue(client)(userID)("queue_laters"),
				])
			return { queuePrevious, nowPlaying, queueNext, queueLater }
		}