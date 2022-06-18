import { PlaylistID } from "@oly_op/musicloud-common"
import { ForbiddenError, UserInputError } from "apollo-server-errors"
import { query as pgHelpersQuery, exists as pgHelpersExists } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { isNotUsersPlaylist } from "../helpers"
import { DELETE_PLAYLIST_BY_ID } from "../../sql"

export const deletePlaylistByID =
	resolver<void, PlaylistID>(
		async ({ args, context }) => {
			const { playlistID } = args
			const { userID } = context.authorization!

			const query = pgHelpersQuery(context.pg)
			const exists = pgHelpersExists(context.pg)

			const playlistExists =
				await exists({
					value: playlistID,
					table: "playlists",
					column: COLUMN_NAMES.PLAYLIST[0],
				})

			if (!playlistExists) {
				throw new UserInputError("Playlist does not exist")
			}

			if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
				throw new ForbiddenError("Unauthorized to delete playlist")
			}

			await query(DELETE_PLAYLIST_BY_ID)({
				variables: { playlistID },
			})

			await context.ag.index.deleteObject(playlistID)
		},
	)