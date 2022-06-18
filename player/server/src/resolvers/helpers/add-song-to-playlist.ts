import { UserInputError } from "apollo-server-errors"
import { PlaylistID, SongID } from "@oly_op/musicloud-common"
import { query, getResultExists, PoolOrClient } from "@oly_op/pg-helpers"

import { IndexOptions } from "../../types"
import { EXISTS_PLAYLIST_SONG, INSERT_PLAYLIST_SONG } from "../../sql"

interface AddSongToPlaylistOptions
	extends SongID, PlaylistID, IndexOptions {}

export const addSongToPlaylist =
	(pg: PoolOrClient) =>
		async (options: AddSongToPlaylistOptions) => {
			const { index, songID, playlistID } = options

			const inPlaylist =
				await query(pg)(EXISTS_PLAYLIST_SONG)({
					parse: getResultExists,
					variables: { songID, playlistID },
				})

			if (inPlaylist) {
				throw new UserInputError("Song already in playlist")
			}

			await query(pg)(INSERT_PLAYLIST_SONG)({
				variables: { index, songID, playlistID },
			})
		}