import { query, getResultExists, PoolOrClient } from "@oly_op/pg-helpers"
import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"

import { EXISTS_PLAYLIST_SONG, INSERT_PLAYLIST_SONG } from "../../sql"

interface AddSongToPlaylistOptions
	extends SongIDBase, PlaylistIDBase {}

export const addSongToPlaylist =
	(client: PoolOrClient) =>
		async (options: AddSongToPlaylistOptions) => {
			const { songID, playlistID } =
				options
			const inPlaylist =
				await query(client)(EXISTS_PLAYLIST_SONG)({
					parse: getResultExists,
					variables: { songID, playlistID },
				})
			if (!inPlaylist) {
				await query(client)(INSERT_PLAYLIST_SONG)({
					variables: { songID, playlistID },
				})
			}
		}