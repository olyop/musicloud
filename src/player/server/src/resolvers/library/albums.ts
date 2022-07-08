import {
	join,
	query,
	getResultCountOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Album, LibraryObjectAtIndexArgs } from "../../types"
import { SELECT_LIBRARY_ALBUMS_TOTAL, SELECT_LIBRARY_ALBUM_AT_INDEX } from "../../sql"

export const albumsTotal =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_LIBRARY_ALBUMS_TOTAL)({
				parse: getResultCountOrNull,
				variables: {
					userID: context.authorization!.userID,
				},
			})
		),
	)

export const albumAtIndex =
	resolver<Album | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_ALBUM_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					userID: context.authorization!.userID,
					orderByField: args.input.orderBy.field,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})
		),
	)