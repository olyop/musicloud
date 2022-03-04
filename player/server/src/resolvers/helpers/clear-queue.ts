import { PoolOrClient } from "@oly_op/pg-helpers"
import { UserID } from "@oly_op/music-app-common/types"

import { updateQueueNowPlaying } from "./update-queue-now-playing"
import { clearQueuePreviousNextLater } from "./clear-queue-previous-next-later"

export const clearQueue =
	(pg: PoolOrClient) =>
		async ({ userID }: UserID) => {
			await clearQueuePreviousNextLater(pg)({ userID })
			await updateQueueNowPlaying(pg)({ userID, value: null })
		}