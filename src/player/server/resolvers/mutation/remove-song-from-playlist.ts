import { query } from "@oly_op/pg-helpers"
import { ForbiddenError } from "apollo-server-fastify"
import { PlaylistID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { DELETE_PLAYLIST_SONG } from "../../sql"
import { IndexOptions, Playlist } from "../../types"
import { getPlaylist, isNotUsersPlaylist } from "../helpers"

interface Args
	extends PlaylistID, IndexOptions {}

export const removeSongFromPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { index, playlistID } = args
			const { userID } = context.authorization!

			if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
				throw new ForbiddenError("Unauthorized to update playlist")
			}

			await query(context.pg)(DELETE_PLAYLIST_SONG)({
				variables: { index, playlistID },
			})

			return getPlaylist(context.pg)({ playlistID })
		},
	)