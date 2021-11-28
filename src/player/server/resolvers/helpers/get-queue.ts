import { PoolOrClient } from "@oly_op/pg-helpers"
import { UserIDBase } from "@oly_op/music-app-common/types"

import { Queue } from "../../types"
import { getQueueSection } from "./get-queue-section"
import { getQueueNowPlaying } from "./get-queue-now-playing"

export const getQueue =
	(client: PoolOrClient) =>
		async ({ userID }: UserIDBase): Promise<Queue> => {
			const [ nowPlaying, next, later, previous ] =
				await Promise.all([
					getQueueNowPlaying(client)({ userID }),
					getQueueSection(client)({ userID, tableName: "queue_nexts" }),
					getQueueSection(client)({ userID, tableName: "queue_laters" }),
					getQueueSection(client)({ userID, tableName: "queue_previous" }),
				])
			return { previous, nowPlaying, next, later }
		}