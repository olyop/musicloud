import { PlaylistID, SongID } from "@oly_op/music-app-common/types"
import { query, getResultExists, PoolOrClient } from "@oly_op/pg-helpers"

import { EXISTS_PLAYLIST_SONG, INSERT_PLAYLIST_SONG } from "../../sql"

interface AddSongToPlaylistOptions
	extends SongID, PlaylistID {}

export const addSongToPlaylist =
	(pg: PoolOrClient) =>
		async (options: AddSongToPlaylistOptions) => {
			const { songID, playlistID } =
				options
			const inPlaylist =
				await query(pg)(EXISTS_PLAYLIST_SONG)({
					parse: getResultExists,
					variables: { songID, playlistID },
				})
			if (!inPlaylist) {
				await query(pg)(INSERT_PLAYLIST_SONG)({
					variables: { songID, playlistID },
				})
			}
		}