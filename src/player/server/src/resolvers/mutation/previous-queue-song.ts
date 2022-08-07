import {
	join,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { isNull } from "lodash-es"

import {
	INSERT_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	SELECT_QUEUE_SONG,
	UPDATE_QUEUE_SONG_CREMENT_INDEX,
} from "../../sql"

import resolver from "./resolver"
import { QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { getQueue, updateQueueNowPlaying } from "../helpers"

export const previousQueueSong =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()

				const { previous, nowPlaying, next, later } =
					await getQueue(client)({ userID })

				if (!isNull(nowPlaying) && !isNull(previous)) {
					const newNowPlaying =
						await query(SELECT_QUEUE_SONG)({
							parse: convertFirstRowToCamelCase<QueueSong>(),
							variables: {
								userID,
								index: previous.length - 1,
								tableName: "queue_previous",
								columnNames: join(COLUMN_NAMES.QUEUE_SONG),
							},
						})

					await query(DELETE_QUEUE_SONG)({
						variables: {
							userID,
							index: previous.length - 1,
							tableName: "queue_previous",
						},
					})

					const queueToBeEdited =
						(isNull(next) ? later : next)!

					const queueToBedEditedName =
						isNull(next) ? "later" : "next"

					if (!isNull(next) || !isNull(later)) {
						for (const queue of queueToBeEdited) {
							await query(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
								variables: {
									userID,
									crement: "+",
									index: queue.index,
									tableName: `queue_${queueToBedEditedName}s`,
								},
							})
						}
					}

					await query(INSERT_QUEUE_SONG)({
						variables: {
							userID,
							index: 0,
							songID: nowPlaying.songID,
							tableName: `queue_${queueToBedEditedName}s`,
						},
					})

					await updateQueueNowPlaying(client, context.ag.index)({
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