import { join, query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { Song } from "../types"
import { COLUMN_NAMES } from "../globals"
import { SELECT_QUEUE_NOW_PLAYING_SONG } from "../sql"
import { createResolver, getQueueSongs } from "./helpers"

const resolver =
	createResolver()

export const previous =
	resolver(
		({ context }) => (
			getQueueSongs(context.pg)({
				tableName: "queue_previous",
				userID: context.authorization!.userID,
			})
		),
	)

export const nowPlaying =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_QUEUE_NOW_PLAYING_SONG)({
				parse: convertFirstRowToCamelCase<Song>(),
				variables: {
					userID: context.authorization!.userID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})
		),
	)

export const next =
	resolver(
		({ context }) => (
			getQueueSongs(context.pg)({
				tableName: "queue_nexts",
				userID: context.authorization!.userID,
			})
		),
	)

export const later =
	resolver(
		({ parent, context }) => (
			getQueueSongs(context.pg)({
				tableName: "queue_laters",
				userID: context.authorization!.userID,
			})
		),
	)