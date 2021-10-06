import { PoolOrClient } from "@oly_op/pg-helpers"

import { clearQueueNext } from "./clear-queue-next"
import { clearQueueLater } from "./clear-queue-later"
import { clearQueuePrevious } from "./clear-queue-previous"

export const clearQueues =
	(client: PoolOrClient) =>
		async (userID: string) => {
			await clearQueueNext(client)(userID)
			await clearQueueLater(client)(userID)
			await clearQueuePrevious(client)(userID)
		}