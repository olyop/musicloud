import {
	join,
	exists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { UserInputError } from "apollo-server-fastify"
import { AlbumIDBase } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../sql"
import { shuffle, clearQueue, updateQueueNowPlaying } from "../helpers"

export const shuffleAlbum =
	resolver<Record<string, never>, AlbumIDBase>(
		async ({ args, context }) => {
			const { albumID } = args
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(context.pg)

			try {
				await query("BEGIN")()

				const albumExists =
					await exists(context.pg)({
						value: albumID,
						table: "albums",
						column: COLUMN_NAMES.ALBUM[0],
					})

				if (!albumExists) {
					throw new UserInputError("Album does not exist")
				}

				await clearQueue(client)({ userID })

				const [ nowPlaying, ...shuffled ] =
					await query(SELECT_ALBUM_SONGS)({
						parse: pipe(
							convertTableToCamelCase<Song>(),
							shuffle(),
						),
						variables: {
							albumID: args.albumID,
							columnNames: join(COLUMN_NAMES.SONG),
						},
					})

				await updateQueueNowPlaying(client)({
					userID,
					value: nowPlaying.songID,
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