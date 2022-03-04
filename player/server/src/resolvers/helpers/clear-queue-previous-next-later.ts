import { PoolOrClient } from "@oly_op/pg-helpers"
import { UserID } from "@oly_op/music-app-common/types"

import { clearQueueNext } from "./clear-queue-next"
import { clearQueueLater } from "./clear-queue-later"
import { clearQueuePrevious } from "./clear-queue-previous"

export const clearQueuePreviousNextLater =
	(client: PoolOrClient) =>
		async ({ userID }: UserID) => {
			await clearQueueNext(client)({ userID })
			await clearQueueLater(client)({ userID })
			await clearQueuePrevious(client)({ userID })
		}