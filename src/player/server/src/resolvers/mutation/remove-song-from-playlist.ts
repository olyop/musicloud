import { query } from "@oly_op/pg-helpers"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"

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
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
				throw new Error("Unauthorized to update playlist")
			}

			await query(context.pg)(DELETE_PLAYLIST_SONG)({
				variables: { index, playlistID },
			})

			return getPlaylist(context.pg)({ playlistID })
		},
	)