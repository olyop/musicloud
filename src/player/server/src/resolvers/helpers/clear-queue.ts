import { PoolOrClient } from "@oly_op/pg-helpers";
import { UserID } from "@oly_op/musicloud-common/build/types";

import { updateQueueNowPlaying } from "./update-queue-now-playing";
import { clearQueuePreviousNextLater } from "./clear-queue-previous-next-later";

export const clearQueue =
	(pg: PoolOrClient) =>
	async ({ userID }: UserID) => {
		await Promise.all([
			clearQueuePreviousNextLater(pg)({ userID }),
			updateQueueNowPlaying(pg)({ userID, value: null }),
		]);
	};
