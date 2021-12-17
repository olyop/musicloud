import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	clearQueue,
	getTopSongs,
	createResolver,
	updateQueueNowPlaying,
} from "../helpers"

import { INSERT_QUEUE_SONG } from "../../sql"

const resolver =
	createResolver()

export const playTopOneHundredSongs =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				await clearQueue(client)({ userID })

				const [ nowPlaying, ...songs ] =
					await getTopSongs(context.pg)(100)

				await updateQueueNowPlaying(client, context.ag)({
					userID,
					value: nowPlaying.songID,
				})

				await Promise.all(
					songs.map(
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

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return {}
		},
	)