import { last } from "lodash-es"
import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types"
import { convertTableToCamelCase, exists, join, query } from "@oly_op/pg-helpers"

import {
	getPlaylist,
	isNotUsersPlaylist,
	addSongToPlaylist as addSongToPlaylistHelper,
} from "../helpers"

import resolver from "./resolver"
import { Playlist, PlaylistSong } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql"

interface Args
	extends SongID, PlaylistID {}

export const addSongToPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { songID, playlistID } = args
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			const playlistExists =
				await exists(context.pg)({
					value: playlistID,
					table: "playlists",
					column: COLUMN_NAMES.PLAYLIST[0],
				})

			if (!playlistExists) {
				throw new Error("Playlist does not exist")
			}

			if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
				throw new Error("Unauthorized to add to playlist")
			}

			const songExists =
				await exists(context.pg)({
					value: songID,
					table: "songs",
					column: COLUMN_NAMES.SONG[0],
				})

			if (!songExists) {
				throw new Error("Song does not exist")
			}

			const playlistSongs =
				await query(context.pg)(SELECT_PLAYLIST_SONGS_RELATIONS)({
					parse: convertTableToCamelCase<PlaylistSong>(),
					variables: {
						playlistID,
						columnNames: join(COLUMN_NAMES.PLAYLIST_SONG),
					},
				})

			const lastPlaylistSong =
				last(playlistSongs)

			const index =
				lastPlaylistSong ?
					lastPlaylistSong.index + 1 :
					0

			await addSongToPlaylistHelper(context.pg)({
				index,
				songID,
				playlistID,
			})

			return getPlaylist(context.pg)({ playlistID })
		},
	)