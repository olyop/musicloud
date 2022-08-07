import {
	join,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { head, isNull } from "lodash-es"

import {
	INSERT_QUEUE_SONG,
	SELECT_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	UPDATE_QUEUE_SONG_CREMENT_INDEX,
} from "../../sql"

import resolver from "./resolver"
import { QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { getQueue, updateQueueNowPlaying } from "../helpers"

export const nextQueueSong =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)
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

					if (head(queueToBeEdited)?.index !== 0) {
						throw new Error("Invalid queue")
					}

					const newNowPlaying =
						await query(SELECT_QUEUE_SONG)({
							parse: convertFirstRowToCamelCase<QueueSong>(),
							variables: {
								userID,
								index: 0,
								tableName: `queue_${queueToBeEditedName}s`,
								columnNames: join(COLUMN_NAMES.QUEUE_SONG),
							},
						})

					await Promise.all([
						query(DELETE_QUEUE_SONG)({
							variables: {
								userID,
								index: 0,
								tableName: `queue_${queueToBeEditedName}s`,
							},
						}),
						...queueToBeEdited
							.filter(
								({ index }) => index !== 0,
							)
							.map(
								queueSong => (
									query(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
										variables: {
											userID,
											crement: "-",
											index: queueSong.index,
											tableName: `queue_${queueToBeEditedName}s`,
										},
									})
								),
							),
						query(INSERT_QUEUE_SONG)({
							variables: {
								userID,
								songID: nowPlaying.songID,
								tableName: "queue_previous",
								index: isNull(previous) ? 0 : previous.length,
							},
						}),
						updateQueueNowPlaying(client, context.ag.index)({
							userID,
							value: newNowPlaying.songID,
						}),
					])
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