import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import {
	DELETE_LIBRARY_SONGS,
	DELETE_LIBRARY_ARTISTS,
	DELETE_LIBRARY_PLAYLISTS,
} from "../../sql"

import resolver from "./resolver"

export const deleteLibrary =
	resolver(
		async ({ context }) => {
			const query = pgHelpersQuery(context.pg)
			const { userID } = context.authorization!

			const variables = { userID }

			await query(DELETE_LIBRARY_SONGS)({ variables })
			await query(DELETE_LIBRARY_ARTISTS)({ variables })
			await query(DELETE_LIBRARY_PLAYLISTS)({ variables })
		},
	)