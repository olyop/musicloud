import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	shuffle,
	getQueueSongs,
	clearQueueNext,
	clearQueueLater,
} from "../../../helpers"

import resolver from "../../resolver"
import { Song } from "../../../../types"
import { INSERT_QUEUE_SONG } from "../../../../sql"

export const shuffleNext =
	resolver(
		async ({ context }) => {
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const nextSongs =
					await getQueueSongs(client)({ userID, tableName: "queue_nexts" })
				const laterSongs =
					await getQueueSongs(client)({ userID, tableName: "queue_laters" })

				if (nextSongs) {
					await clearQueueNext(client)({ userID })
					const nextSongsShuffled =	await shuffle(context.randomDotOrg)<Song>(nextSongs)
					await Promise.all(
						nextSongsShuffled.map(
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
				}

				if (laterSongs) {
					await clearQueueLater(client)({ userID })
					const laterSongsShuffled = await shuffle(context.randomDotOrg)<Song>(laterSongs)
					await Promise.all(
						laterSongsShuffled.map(
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
				}

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}
		},
	)