import {
	query as pgQuery,
	exists as pgExists,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { SongIDBase } from "@oly_op/music-app-common/types"

import { User, QueuesNowPlaying } from "../../types"
import { createResolver, getUserWithQueues } from "../helpers"
import { SELECT_QUEUE, INSERT_QUEUE_SONG } from "../../sql"

const resolver =
	createResolver()

export const queueSongAfter =
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
						parse: convertTableToCamelCase<QueuesNowPlaying>(),
						variables: {
							userID,
							columnNames: "*",
							tableName: "queue_nexts",
						},
					})

				await query(INSERT_QUEUE_SONG)({
					variables: {
						userID,
						index: nexts.length,
						songID: args.songID,
						tableName: "queue_nexts",
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