import { AlbumID } from "@oly_op/musicloud-common/build/types"
import { join, query, exists, convertTableToCamelCase } from "@oly_op/pg-helpers"

import resolver from "../../resolver"
import { Song } from "../../../../types"
import { COLUMN_NAMES } from "../../../../globals"
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../../../sql"
import { shuffle, clearQueue, updateQueueNowPlaying } from "../../../helpers"

export const shuffleAlbum =
	resolver<Record<string, never>, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)
			const client = await context.pg.connect()

			try {
				await query(client)("BEGIN")()

				const albumExists =
					await exists(context.pg)({
						value: albumID,
						table: "albums",
						column: COLUMN_NAMES.ALBUM[0],
					})

				if (!albumExists) {
					throw new Error("Album does not exist")
				}

				await clearQueue(client)({ userID })

				const albumsSongs =
					await query(client)(SELECT_ALBUM_SONGS)({
						parse: convertTableToCamelCase<Song>(),
						variables: {
							albumID,
							columnNames: join(COLUMN_NAMES.SONG),
						},
					})

				const [ nowPlaying, ...shuffled ] =
					await shuffle(context.randomDotOrg)(albumsSongs)

				await updateQueueNowPlaying(client, context.ag.index)({
					userID,
					value: nowPlaying!.songID,
				})

				let index = 0
				for (const { songID } of shuffled) {
					await query(client)(INSERT_QUEUE_SONG)({
						variables: {
							index,
							userID,
							songID,
							tableName: "queue_laters",
						},
					})
					index += 1
				}

				await query(client)("COMMIT")()
			} catch (error) {
				await query(client)("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return {}
		},
	)