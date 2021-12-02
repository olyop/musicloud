import { query } from "@oly_op/pg-helpers"
import { PlaylistID, SongID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { getPlaylist } from "../helpers"
import { DELETE_PLAYLIST_SONG } from "../../sql"

interface Args
	extends SongID, PlaylistID {}

export const removeSongFromPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { songID, playlistID } = args

			await query(context.pg)(DELETE_PLAYLIST_SONG)({
				variables: { songID, playlistID },
			})

			return getPlaylist(context.pg)({ playlistID })
		},
	)