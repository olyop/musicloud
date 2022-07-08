import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	shuffle,
	getQueueSongs,
	clearQueueNext,
	clearQueueLater,
} from "../helpers"

import resolver from "./resolver"
import { Song } from "../../types"
import { INSERT_QUEUE_SONG } from "../../sql"

export const shuffleNext =
	resolver(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const nextSongs =
					await getQueueSongs(client)({ userID, tableName: "queue_nexts" })
				const laterSongs =
					await getQueueSongs(client)({ userID, tableName: "queue_laters" })

				const nextSongsShuffled =
					shuffle<Song>()(nextSongs)
				const laterSongsShuffled =
					shuffle<Song>()(laterSongs)

				await clearQueueNext(client)({ userID })
				await clearQueueLater(client)({ userID })

				await Promise.all([
					...nextSongsShuffled.map(
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
					...laterSongsShuffled.map(
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
				])

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}
		},
	)