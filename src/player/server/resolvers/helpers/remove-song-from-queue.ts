import {
	Pool,
	join,
	getResultExists,
	query as pgQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"

import {
	SELECT_QUEUE,
	EXISTS_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	UPDATE_USER_QUEUE_SONG,
} from "../../sql"

import { COLUMN_NAMES } from "../../globals"
import { User, QueueSong } from "../../types"
import { getUserWithQueues } from "./get-user-with-queues"

export const removeSongFromQueue =
	(pool: Pool) =>
		(userID: string) =>
			async (tableName: string, index: number) => {
				const client = await pool.connect()
				const query = pgQuery(client)

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
					throw new UserInputError("QueueSong song does not exist.")
				}

				let user: User

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
						await query(UPDATE_USER_QUEUE_SONG)({
							variables: {
								userID,
								tableName,
								addSubtract: "-",
								index: queueSong.index,
							},
						})
					}

					user = await getUserWithQueues(client)(userID)

					await query("COMMIT")()
				} catch (error) {
					await query("ROLLBACK")()
					throw error
				} finally {
					client.release()
				}

				return user
			}