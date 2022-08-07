import {
	join,
	query,
	getResultCountOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { determineSongsSQLOrderByField } from "../helpers"
import { Song, LibraryObjectAtIndexArgs } from "../../types"
import { SELECT_LIBRARY_SONGS_TOTAL, SELECT_LIBRARY_SONG_AT_INDEX } from "../../sql"

export const songsTotal =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_LIBRARY_SONGS_TOTAL)({
				parse: getResultCountOrNull,
				variables: {
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				},
			})
		),
	)

export const songAtIndex =
	resolver<Song | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_SONG_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByDirection: args.input.orderBy.direction,
					orderByField: determineSongsSQLOrderByField(args.input.orderBy.field),
				},
			})
		),
	)