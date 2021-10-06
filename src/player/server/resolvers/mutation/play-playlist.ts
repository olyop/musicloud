import {
	join,
	query as pgQuery,
	exists as pgExists,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { isEmpty } from "lodash"
import { UserInputError } from "apollo-server-fastify"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import {
	createResolver,
	getUserWithQueues,
	clearQueuesNowPlaying,
	updateUserNowPlaying,
} from "../helpers"

import { Song, User } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_PLAYLIST_SONGS } from "../../sql"

const resolver =
	createResolver()

export const playPlaylist =
	resolver<User, PlaylistIDBase>(
		async ({ parent, args, context }) => {
			const { playlistID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)
			const exists = pgExists(client)

			let user: User

			try {
				await query("BEGIN")()

				const playlistExists =
					await exists({
						value: playlistID,
						table: "playlists",
						column: "playlist_id",
					})

				if (!playlistExists) {
					throw new UserInputError("Playlist does not exist.")
				}

				await clearQueuesNowPlaying(client)(userID)

				const playlistSongs =
					await query(SELECT_PLAYLIST_SONGS)({
						parse: convertTableToCamelCase<Song>(),
						variables: {
							playlistID: args.playlistID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})

				if (isEmpty(playlistSongs)) {
					throw new UserInputError("Playlist is empty")
				}

				const [ nowPlaying, ...songs ] =
					playlistSongs

				await updateUserNowPlaying(client)(userID, nowPlaying.songID)

				await Promise.all(songs.map(
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