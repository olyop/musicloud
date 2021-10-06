import {
	join,
	query as pgQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { isEmpty } from "lodash"

import {
	createResolver,
	getUserWithQueues,
	getQueuesNowPlaying,
	updateUserNowPlaying,
} from "../helpers"

import {
	SELECT_USER_BY_ID,
	INSERT_QUEUE_SONG,
	DELETE_QUEUE_SONG,
	SELECT_QUEUE_SONG,
	UPDATE_USER_QUEUE_SONG,
} from "../../sql"

import { User, QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"

const resolver =
	createResolver()

export const previousQueueSong =
	resolver(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)

			let user: User

			try {
				await query("BEGIN")()

				const { queuePrevious, nowPlaying, queueNext, queueLater } =
					await getQueuesNowPlaying(client)(userID)

				if (!isEmpty(queuePrevious)) {
					const newNowPlaying =
						await query(SELECT_QUEUE_SONG)({
							parse: convertFirstRowToCamelCase<QueueSong>(),
							variables: {
								userID,
								tableName: "queue_previous",
								index: queuePrevious.length - 1,
								columnNames: join(COLUMN_NAMES.QUEUE_SONG),
							},
						})

					await query(DELETE_QUEUE_SONG)({
						variables: {
							userID,
							tableName: "queue_previous",
							index: queuePrevious.length - 1,
						},
					})

					if (!isEmpty(queueNext) || !isEmpty(queueLater)) {
						for (const queue of isEmpty(queueNext) ? queueLater : queueNext) {
							await query(UPDATE_USER_QUEUE_SONG)({
								variables: {
									userID,
									addSubtract: "+",
									index: queue.index,
									tableName: `queue_${isEmpty(queueNext) ? "later" : "next"}s`,
								},
							})
						}
					}

					await query(INSERT_QUEUE_SONG)({
						variables: {
							userID,
							index: 0,
							songID: nowPlaying!,
							tableName: `queue_${isEmpty(queueNext) ? "later" : "next"}s`,
						},
					})

					await updateUserNowPlaying(client)(userID, newNowPlaying.songID)

					user = await getUserWithQueues(client)(userID)
				} else {
					user = await query(SELECT_USER_BY_ID)({
						parse: convertFirstRowToCamelCase<User>(),
						variables: {
							userID,
							columnNames: join(COLUMN_NAMES.USER),
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

			return user
		},
	)