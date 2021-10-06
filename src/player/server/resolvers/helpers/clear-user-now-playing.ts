import { query, PoolOrClient } from "@oly_op/pg-helpers"

import { UPDATE_USER_NOW_PLAYING_NULL } from "../../sql"

export const clearUserNowPlaying =
	(client: PoolOrClient) =>
		async (userID: string) => {
			await query(client)(UPDATE_USER_NOW_PLAYING_NULL)({
				variables: { userID },
			})
		}