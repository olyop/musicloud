import {
	join,
	query,
	getResultCount,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Genre, LibraryObjectAtIndexArgs } from "../../types"
import { SELECT_LIBRARY_GENRES_TOTAL, SELECT_LIBRARY_GENRE_AT_INDEX } from "../../sql"

export const genresTotal =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_LIBRARY_GENRES_TOTAL)({
				parse: getResultCount,
				variables: {
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				},
			})
		),
	)

export const genreAtIndex =
	resolver<Genre | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_GENRE_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					orderByField: args.input.orderBy.field,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.GENRE, "genres"),
				},
			})
		),
	)