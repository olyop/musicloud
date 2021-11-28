import {
	join,
	exists as pgExists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { isEmpty } from "lodash"
import { UserInputError } from "apollo-server-fastify"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { clearQueue, updateQueueNowPlaying } from "../helpers"
import { INSERT_QUEUE_SONG, SELECT_PLAYLIST_SONGS } from "../../sql"

export const playPlaylist =
	resolver<Record<string, never>, PlaylistIDBase>(
		async ({ parent, args, context }) => {
			const { playlistID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)
			const exists = pgExists(client)

			try {
				await query("BEGIN")()

				const playlistExists =
					await exists({
						value: playlistID,
						table: "playlists",
						column: COLUMN_NAMES.PLAYLIST[0],
					})

				if (!playlistExists) {
					throw new UserInputError("Playlist does not exist")
				}

				await clearQueue(client)({ userID })

				const playlistSongs =
					await query(SELECT_PLAYLIST_SONGS)({
						parse: convertTableToCamelCase<Song>(),
						variables: {
							playlistID: args.playlistID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})

				if (!isEmpty(playlistSongs)) {
					const [ nowPlaying, ...songs ] =
						playlistSongs

					await updateQueueNowPlaying(client)({
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