import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	clearQueue,
	getTopSongs,
	updateQueueNowPlaying,
} from "../helpers"

import resolver from "./resolver"
import { INSERT_QUEUE_SONG } from "../../sql"

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

				await updateQueueNowPlaying(client, context.ag.index)({
					userID,
					value: nowPlaying!.songID,
				})

				let index = 0
				for (const { songID } of songs) {
					await query(INSERT_QUEUE_SONG)({
						variables: {
							index,
							userID,
							songID,
							tableName: "queue_laters",
						},
					})
					index += 1
				}

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