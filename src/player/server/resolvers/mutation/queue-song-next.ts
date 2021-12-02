import {
	join,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { isNull } from "lodash"
import { UserInputError } from "apollo-server-fastify"
import { SongID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE, INSERT_QUEUE_SONG, UPDATE_QUEUE_SONG } from "../../sql"

export const queueSongNext =
	resolver<Record<string, never>, SongID>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)
			const exists = pgHelpersExists(client)

			const songExists =
				await exists({
					value: songID,
					table: "songs",
					column: COLUMN_NAMES.SONG[0],
				})

			if (!songExists) {
				throw new UserInputError("Song does not exist")
			}

			try {
				await query("BEGIN")()

				const nexts =
					await query(SELECT_QUEUE)({
						parse: convertTableToCamelCaseOrNull<QueueSong>(),
						variables: {
							userID,
							tableName: "queue_nexts",
							columnNames: join(COLUMN_NAMES.QUEUE_SONG),
						},
					})

				if (!isNull(nexts)) {
					await Promise.all(
						nexts.map(
							next => (
								query(UPDATE_QUEUE_SONG)({
									variables: {
										userID,
										addSubtract: "+",
										index: next.index,
										tableName: "queue_nexts",
									},
								})
							),
						),
					)
					await query(INSERT_QUEUE_SONG)({
						variables: {
							userID,
							index: 0,
							songID: args.songID,
							tableName: "queue_nexts",
						},
					})
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