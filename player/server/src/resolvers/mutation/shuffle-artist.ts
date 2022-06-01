import { pipe } from "rxjs"
import { ArtistID } from "@oly_op/musicloud-common"
import { join, query as pgHelpersQuery, convertTableToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_ARTIST_SONGS } from "../../sql"
import { shuffle, clearQueue, updateQueueNowPlaying } from "../helpers"

export const shuffleArtist =
	resolver<Record<string, never>, ArtistID>(
		async ({ args, context }) => {
			const { artistID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				await clearQueue(client)({ userID })

				const [ nowPlaying, ...shuffled ] =
					await query(SELECT_ARTIST_SONGS)({
						parse: pipe(
							convertTableToCamelCase<Song>(),
							shuffle(),
						),
						variables: {
							artistID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})

				await updateQueueNowPlaying(client, context.ag.index)({
					userID,
					value: nowPlaying!.songID,
				})

				await Promise.all(
					shuffled.map(
						({ songID }, index) => (
							query(INSERT_QUEUE_SONG)({
								variables: {
									index,
									songID,
									userID,
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