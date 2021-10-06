import {
	join,
	query as pgQuery,
	exists as pgExists,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import {
	createResolver,
	getUserWithQueues,
	clearQueuesNowPlaying,
	updateUserNowPlaying,
} from "../helpers"

import { User, Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../sql"

const resolver =
	createResolver()

export const playAlbum =
	resolver<User, AlbumIDBase>(
		async ({ args, context }) => {
			const { albumID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)
			const exists = pgExists(client)

			let user: User

			try {
				await query("BEGIN")()

				const albumExists =
					await exists({
						value: albumID,
						table: "albums",
						column: "album_id",
					})

				if (!albumExists) {
					throw new UserInputError("Album does not exist.")
				}

				await clearQueuesNowPlaying(client)(userID)

				const [ nowPlaying, ...songs ] =
					await query(SELECT_ALBUM_SONGS)({
						parse: convertTableToCamelCase<Song>(),
						variables: {
							albumID: args.albumID,
							columnNames: join(COLUMN_NAMES.SONG),
						},
					})

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