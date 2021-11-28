import {
	join,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { isNull } from "lodash"

import {
	INSERT_QUEUE_SONG,
	SELECT_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	UPDATE_QUEUE_SONG,
} from "../../sql"

import resolver from "./resolver"
import { QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { getQueue, updateQueueNowPlaying } from "../helpers"

export const nextQueueSong =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const { previous, nowPlaying, next, later } =
					await getQueue(client)({ userID })

				if (!isNull(nowPlaying) && (!isNull(next) || !isNull(later))) {
					const queueToBeEdited =
						(isNull(next) ? later : next)!

					const queueToBeEditedName =
						isNull(next) ? "later" : "next"

					const newNowPlaying =
						await query(SELECT_QUEUE_SONG)({
							parse: convertFirstRowToCamelCase<QueueSong>(),
							variables: {
								userID,
								index: 0,
								columnNames: join(COLUMN_NAMES.QUEUE_SONG),
								tableName: `queue_${queueToBeEditedName}s`,
							},
						})

					await query(DELETE_QUEUE_SONG)({
						variables: {
							userID,
							index: 0,
							tableName: `queue_${queueToBeEditedName}s`,
						},
					})

					for (const queue of queueToBeEdited) {
						if (queue.index !== 0) {
							await query(UPDATE_QUEUE_SONG)({
								variables: {
									userID,
									addSubtract: "-",
									index: queue.index,
									tableName: `queue_${queueToBeEditedName}s`,
								},
							})
						}
					}

					await query(INSERT_QUEUE_SONG)({
						variables: {
							userID,
							songID: nowPlaying.songID,
							tableName: "queue_previous",
							index: isNull(previous) ? 0 : previous.length,
						},
					})

					await updateQueueNowPlaying(client)({
						userID,
						value: newNowPlaying.songID,
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