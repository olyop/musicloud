import pipe from "@oly_op/pipe"
import { isEmpty } from "lodash"
import { convertTableToCamelCase, join, query as pgQuery } from "@oly_op/pg-helpers"

import {
	shuffle,
	clearQueues,
	createResolver,
	getUserWithQueues,
	updateUserNowPlaying,
} from "../helpers"

import { Song, User } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_LIBRARY_SONGS } from "../../sql"

const resolver =
	createResolver()

export const shuffleLibrary =
	resolver<User>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)

			let user: User

			try {
				await query("BEGIN")()

				await clearQueues(client)(userID)

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

					await updateUserNowPlaying(client)(userID, nowPlaying.songID)

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