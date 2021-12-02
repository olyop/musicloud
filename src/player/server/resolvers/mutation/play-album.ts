import {
	join,
	query as pgHelpersQuery,
	convertTableToCamelCase,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { AlbumID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { clearQueue, updateQueueNowPlaying } from "../helpers"
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../sql"

export const playAlbum =
	resolver<Record<string, never>, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)
			const exists = pgHelpersExists(client)

			try {
				await query("BEGIN")()

				const albumExists =
					await exists({
						value: albumID,
						table: "albums",
						column: COLUMN_NAMES.ALBUM[0],
					})

				if (!albumExists) {
					throw new UserInputError("Album does not exist")
				}

				await clearQueue(client)({ userID })

				const [ nowPlaying, ...songs ] =
					await query(SELECT_ALBUM_SONGS)({
						parse: convertTableToCamelCase<Song>(),
						variables: {
							albumID,
							columnNames: join(COLUMN_NAMES.SONG),
						},
					})

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