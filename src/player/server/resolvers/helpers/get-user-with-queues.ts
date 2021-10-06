import {
	join,
	query,
	PoolOrClient,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { User } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_USER_BY_ID } from "../../sql"
import { getQueueSongIDs } from "./get-queue-song-ids"

export const getUserWithQueues =
	(client: PoolOrClient) =>
		async (userID: string): Promise<User> => ({
			...await query(client)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			}),
			queueNext: await getQueueSongIDs(client)(userID)("queue_nexts"),
			queueLater: await getQueueSongIDs(client)(userID)("queue_laters"),
			queuePrevious: await getQueueSongIDs(client)(userID)("queue_previous"),
		})