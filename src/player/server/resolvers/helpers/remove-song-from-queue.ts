import {
	join,
	getResultExists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { Pool } from "pg"
import { UserInputError } from "apollo-server-fastify"
import { UserID } from "@oly_op/music-app-common/types"

import {
	SELECT_QUEUE,
	EXISTS_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	UPDATE_QUEUE_SONG,
} from "../../sql"

import { COLUMN_NAMES } from "../../globals"
import { QueueSong, IndexOptions, TableNameOptions } from "../../types"

export interface RemoveSongFromQueueOptions
	extends UserID, IndexOptions, TableNameOptions {}

export const removeSongFromQueue =
	(pool: Pool) =>
		async (options: RemoveSongFromQueueOptions) => {
			const { userID, tableName, index } = options

			const client = await pool.connect()
			const query = pgHelpersQuery(client)

			const queueSongExists =
				await query(EXISTS_QUEUE_SONG)({
					parse: getResultExists,
					variables: {
						index,
						userID,
						tableName,
					},
				})

			if (!queueSongExists) {
				throw new UserInputError("Queue song does not exist")
			}

			try {
				await query("BEGIN")()

				const queueSongs =
					await query(SELECT_QUEUE)({
						parse: convertTableToCamelCase<QueueSong>(),
						variables: {
							userID,
							tableName,
							columnNames: join(COLUMN_NAMES.QUEUE_SONG),
						},
					})

				const queueSongsAfter =
					queueSongs.slice(index + 1)

				await query(DELETE_QUEUE_SONG)({
					variables: {
						index,
						userID,
						tableName,
					},
				})

				for (const queueSong of queueSongsAfter) {
					await query(UPDATE_QUEUE_SONG)({
						variables: {
							userID,
							tableName,
							addSubtract: "-",
							index: queueSong.index,
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

			return {} as Record<string, never>
		}