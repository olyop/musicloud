import { query as pgQuery } from "@oly_op/pg-helpers"

import {
	shuffle,
	getQueueSongs,
	createResolver,
	clearQueueNext,
	clearQueueLater,
	getUserWithQueues,
} from "../helpers"

import { Song, User } from "../../types"
import { INSERT_QUEUE_SONG } from "../../sql"

const resolver =
	createResolver()

export const shuffleNext =
	resolver<User>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)

			let user: User

			try {
				await query("BEGIN")()

				const nextSongs =
					await getQueueSongs(client)(userID)("queue_nexts")

				const laterSongs =
					await getQueueSongs(client)(userID)("queue_laters")

				await clearQueueNext(client)(userID)
				await clearQueueLater(client)(userID)

				await Promise.all(
					shuffle<Song>()(nextSongs).map(
						({ songID }, index) => (
							query(INSERT_QUEUE_SONG)({
								variables: {
									index,
									userID,
									songID,
									tableName: "queue_nexts",
								},
							})
						),
					),
				)

				await Promise.all(
					shuffle<Song>()(laterSongs).map(
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
					),
				)

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