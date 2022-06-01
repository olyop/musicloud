import {
	join,
	getResultExists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { find, isEmpty } from "lodash-es"
import { UserInputError } from "apollo-server-fastify"

import {
	SELECT_QUEUE,
	DELETE_QUEUE_SONG,
	EXISTS_QUEUE_SONG,
	UPDATE_QUEUE_SONG_INDEX,
} from "../../sql"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { IndexOptions, QueueSong } from "../../types"
import { updateQueueNowPlaying } from "../helpers"

export const jumpToSongInQueueLater =
	resolver<Record<string, never>, IndexOptions>(
		async ({ args, context }) => {
			const { userID } = context.authorization!

			const pg = await context.pg.connect()
			const query = pgHelpersQuery(pg)

			const queueSongExists =
				await query(EXISTS_QUEUE_SONG)({
					parse: getResultExists,
					variables: {
						userID,
						index: args.index,
						tableName: "queue_laters",
					},
				})

			if (!queueSongExists) {
				throw new UserInputError("Queue song does not exist")
			}

			try {
				await query("BEGIN")()

				const nextSongs =
					await query(SELECT_QUEUE)({
						parse: convertTableToCamelCase<QueueSong>(),
						variables: {
							userID,
							tableName: "queue_nexts",
							columnNames: join(COLUMN_NAMES.QUEUE_SONG),
						},
					})

				const laterSongs =
					await query(SELECT_QUEUE)({
						parse: convertTableToCamelCase<QueueSong>(),
						variables: {
							userID,
							tableName: "queue_laters",
							columnNames: join(COLUMN_NAMES.QUEUE_SONG),
						},
					})

				if (isEmpty(nextSongs) && !isEmpty(laterSongs)) {
					await updateQueueNowPlaying(pg, context.ag.index)({
						userID,
						value: find(laterSongs, { index: args.index })!.songID,
					})

					await Promise.all(
						laterSongs.slice(0, args.index).map(
							queueSong => (
								query(DELETE_QUEUE_SONG)({
									variables: {
										userID,
										index: queueSong.index,
										tableName: "queue_laters",
									},
								})
							),
						),
					)

					await query(DELETE_QUEUE_SONG)({
						variables: {
							userID,
							index: args.index,
							tableName: "queue_laters",
						},
					})

					await Promise.all(
						laterSongs.slice(args.index + 1).map(
							({ index }, newIndex) => (
								query(UPDATE_QUEUE_SONG_INDEX)({
									variables: {
										index,
										userID,
										newIndex,
										tableName: "queue_laters",
									},
								})
							),
						),
					)
				}

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				pg.release()
			}

			return {}
		},
	)