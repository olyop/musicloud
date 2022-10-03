import {
	join,
	query,
	getResultRowCountOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Artist, LibraryObjectAtIndexArgs } from "../../types"
import { SELECT_LIBRARY_ARTISTS, SELECT_LIBRARY_ARTIST_AT_INDEX } from "../../sql"

export const artistsTotal =
	resolver(
		({ context }) => (
			query(context.pg)(SELECT_LIBRARY_ARTISTS)({
				parse: getResultRowCountOrNull,
				variables: {
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
				},
			})
		),
	)

export const artistAtIndex =
	resolver<Artist | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_ARTIST_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					orderByField: args.input.orderBy.field,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					orderByTableName:
						args.input.orderBy.field === "DATE_ADDED" ?
							"library_artists" : "artists",
				},
			})
		),
	)