import { query as pgHelpersQuery, exists as pgHelpersExists } from "@oly_op/pg-helpers"

import { PlaylistIDBase } from "@oly_op/music-app-common/types"
import { ForbiddenError, UserInputError } from "apollo-server-fastify"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { isNotUsersPlaylist } from "../helpers"
import { DELETE_PLAYLIST_BY_ID } from "../../sql"

export const deletePlaylistByID =
	resolver<void, PlaylistIDBase>(
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
		},
	)