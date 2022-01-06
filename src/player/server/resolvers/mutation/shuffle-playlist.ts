import { pipe } from "rxjs"
import { isEmpty } from "lodash-es"
import { PlaylistID } from "@oly_op/music-app-common/types"
import { join, query as pgHelpersQuery, convertTableToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_PLAYLIST_SONGS } from "../../sql"
import { shuffle, clearQueue, updateQueueNowPlaying } from "../helpers"

export const shufflePlaylist =
	resolver<Record<string, never>, PlaylistID>(
		async ({ args, context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const songs =
					await query(SELECT_PLAYLIST_SONGS)({
						parse: pipe(
							convertTableToCamelCase<Song>(),
							shuffle(),
						),
						variables: {
							playlistID: args.playlistID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})

				if (!isEmpty(songs)) {
					await clearQueue(client)({ userID })

					const [ nowPlaying, ...shuffled ] = songs

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

			return {}
		},
	)