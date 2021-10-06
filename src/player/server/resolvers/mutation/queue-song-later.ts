import {
	join,
	query as pgQuery,
	exists as pgExists,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { SongIDBase } from "@oly_op/music-app-common/types"

import {
	SELECT_QUEUE,
	INSERT_QUEUE_SONG,
	UPDATE_USER_QUEUE_SONG,
} from "../../sql"

import { User, QueueSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { createResolver, getUserWithQueues } from "../helpers"

const resolver =
	createResolver()

export const queueSongLater =
	resolver<User, SongIDBase>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const client = await context.pg.connect()
			const query = pgQuery(client)
			const exists = pgExists(client)

			let user: User

			try {
				await query("BEGIN")()

				const songExists =
					await exists({
						value: songID,
						table: "songs",
						column: "song_id",
					})

				if (!songExists) {
					throw new UserInputError("Song does not exist.")
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

				for (const next of nexts) {
					await query(UPDATE_USER_QUEUE_SONG)({
						variables: {
							userID,
							addSubtract: "+",
							index: next.index,
							songID: next.songID,
							tableName: "queue_laters",
						},
					})
				}

				await query(INSERT_QUEUE_SONG)({
					variables: {
						userID,
						songID,
						index: 0,
						tableName: "queue_laters",
					},
				})

				user = await getUserWithQueues(client)(userID)

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