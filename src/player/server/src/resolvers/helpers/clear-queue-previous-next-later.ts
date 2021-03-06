import { UserID } from "@oly_op/musicloud-common"
import { PoolOrClient } from "@oly_op/pg-helpers"

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