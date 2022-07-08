import { QUEUE_PAGE_SIZE } from "@oly_op/musicloud-common"
import { join, query, convertFirstRowToCamelCaseOrNull } from "@oly_op/pg-helpers"

import { Song } from "../types"
import { COLUMN_NAMES } from "../globals"
import { getQueueSongs } from "./helpers"
import { SELECT_QUEUE_NOW_PLAYING_SONG } from "../sql"
import createParentResolver from "./create-parent-resolver"

const resolver =
	createParentResolver()

export const previous =
	resolver(
		({ context }) => (
			getQueueSongs(context.pg)({
				limit: QUEUE_PAGE_SIZE,
				tableName: "queue_previous",
				userID: context.authorization!.userID,
			})
		),
	)

export const nowPlaying =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_QUEUE_NOW_PLAYING_SONG)({
				parse: convertFirstRowToCamelCaseOrNull<Song>(),
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
				limit: QUEUE_PAGE_SIZE,
				tableName: "queue_nexts",
				userID: context.authorization!.userID,
			})
		),
	)

export const later =
	resolver(
		({ context }) => (
			getQueueSongs(context.pg)({
				limit: QUEUE_PAGE_SIZE,
				tableName: "queue_laters",
				userID: context.authorization!.userID,
			})
		),
	)