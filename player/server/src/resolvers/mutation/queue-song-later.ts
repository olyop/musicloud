import {
	join,
	exists as pgExists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { SongID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE, INSERT_QUEUE_SONG } from "../../sql"

export const queueSongLater =
	resolver<Record<string, never>, SongID>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)
			const exists = pgExists(client)

			try {
				await query("BEGIN")()

				const songExists =
					await exists({
						value: songID,
						table: "songs",
						column: COLUMN_NAMES.SONG[0],
					})

				if (!songExists) {
					throw new UserInputError("Song does not exist")
				}

				const nexts =
					await query(SELECT_QUEUE)({
						parse: convertTableToCamelCase<QueueSong>(),
						variables: {
							userID,
							tableName: "queue_laters",
							columnNames: join(COLUMN_NAMES.QUEUE_SONG),
						},
					})

				await query(INSERT_QUEUE_SONG)({
					variables: {
						userID,
						songID,
						index: nexts.length,
						tableName: "queue_laters",
					},
				})

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