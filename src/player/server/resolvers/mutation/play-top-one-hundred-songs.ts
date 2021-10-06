import { query as pgQuery } from "@oly_op/pg-helpers"

import {
	getTopSongs,
	createResolver,
	getUserWithQueues,
	clearQueuesNowPlaying,
	updateUserNowPlaying,
} from "../helpers"

import { User } from "../../types"
import { INSERT_QUEUE_SONG } from "../../sql"

const resolver =
	createResolver()

export const playTopOneHundredSongs =
	resolver(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)

			let user: User

			try {
				await query("BEGIN")()

				await clearQueuesNowPlaying(client)(userID)

				const [ nowPlaying, ...songs ] =
					await getTopSongs(context.pg)(100)

				await updateUserNowPlaying(client)(userID, nowPlaying.songID)

				await Promise.all(songs.map(
					({ songID }, index) => (
						query(INSERT_QUEUE_SONG)({
							variables: {
								index,
								userID,
								songID,
								tableName: "queue_laters",
							},
						})
					),
				))

				user = await getUserWithQueues(client)(userID)

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return user
		},
	)