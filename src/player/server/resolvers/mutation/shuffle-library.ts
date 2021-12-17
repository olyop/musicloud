import pipe from "@oly_op/pipe"
import { isEmpty } from "lodash"
import { convertTableToCamelCase, join, query as pgHelpersQuery } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_LIBRARY_SONGS } from "../../sql"
import { shuffle, clearQueue, updateQueueNowPlaying } from "../helpers"

export const shuffleLibrary =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				await clearQueue(client)({ userID })

				const librarySongs =
					await query(SELECT_LIBRARY_SONGS)({
						variables: {
							userID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
						parse: pipe(
							convertTableToCamelCase<Song>(),
							shuffle(),
						),
					})

				if (!isEmpty(librarySongs)) {
					const [ nowPlaying, ...shuffled ] =
						librarySongs

					await updateQueueNowPlaying(client, context.ag)({
						userID,
						value: nowPlaying.songID,
					})

					await Promise.all(shuffled.map(
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