import {
	join,
	convertTableToCamelCase,
	query as pgHelpersQuery,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import {
	shuffle,
	clearQueues,
	createResolver,
	getUserWithQueues,
	updateUserNowPlaying,
} from "../helpers"

import { User, Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_PLAYLIST_SONGS } from "../../sql"

const resolver =
	createResolver()

export const shufflePlaylist =
	resolver<User, PlaylistIDBase>(
		async ({ args, context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			let user: User

			try {
				await query("BEGIN")()

				await clearQueues(client)(userID)

				const [ nowPlaying, ...shuffled ] =
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