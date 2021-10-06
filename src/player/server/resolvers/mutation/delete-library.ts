import {
	join,
	query as pgQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	SELECT_USER_BY_ID,
	DELETE_LIBRARY_SONGS,
	DELETE_LIBRARY_ARTISTS,
	DELETE_LIBRARY_PLAYLISTS,
} from "../../sql"

import { User } from "../../types"
import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

const resolver =
	createResolver()

export const deleteLibrary =
	resolver<User>(
		async ({ context }) => {
			const query = pgQuery(context.pg)
			const { userID } = context.authorization!

			const variables = { userID }

			await query(DELETE_LIBRARY_SONGS)({ variables })
			await query(DELETE_LIBRARY_ARTISTS)({ variables })
			await query(DELETE_LIBRARY_PLAYLISTS)({ variables })

			return query(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})
		},
	)