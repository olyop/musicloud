import {
	getResultRowCount,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers"

import { SongID } from "@oly_op/musicloud-common"
import { UserInputError } from "apollo-server-errors"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE, INSERT_QUEUE_SONG } from "../../sql"

export const queueSongAfter =
	resolver<Record<string, never>, SongID>(
		async ({ args, context }) => {
			const { songID } = args
			const { userID } = context.authorization!

			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)
			const exists = pgHelpersExists(client)

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
						parse: getResultRowCount,
						variables: {
							userID,
							columnNames: "*",
							tableName: "queue_nexts",
						},
					})

				await query(INSERT_QUEUE_SONG)({
					variables: {
						userID,
						index: nexts,
						songID: args.songID,
						tableName: "queue_nexts",
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