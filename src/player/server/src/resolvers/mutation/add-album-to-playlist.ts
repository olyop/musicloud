import { last } from "lodash-es"
import { AlbumID, PlaylistID } from "@oly_op/musicloud-common/build/types"
import { join, exists, convertTableToCamelCase, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Playlist, PlaylistSong } from "../../types"
import { isSongInPlaylist } from "../helpers/is-song-in-playlist"
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers"
import { SELECT_ALBUM_SONGS, SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql"

interface Args
	extends AlbumID, PlaylistID {}

export const addAlbumToPlaylist =
	resolver<Playlist, Args>(
		async ({ context, args }) => {
			const { albumID, playlistID } = args
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			const albumExists =
				await exists(context.pg)({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new Error("Album does not exist")
			}

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

			const albumSongs =
				await query(context.pg)(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID,
						columnNames: COLUMN_NAMES.SONG[0],
					},
				})

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

			let startingIndex: number
			if (lastPlaylistSong) {
				startingIndex = lastPlaylistSong.index + 1
			} else {
				throw new Error("No songs in album")
			}

			let index = 0
			for (const { songID } of albumSongs) {
				const isInPlaylist = await isSongInPlaylist(context.pg)({ songID, playlistID })
				if (!isInPlaylist) {
					await addSongToPlaylist(context.pg)({
						songID,
						playlistID,
						index: startingIndex + index,
					})
					index += 1
				}
			}

			return getPlaylist(context.pg)({ playlistID })
		},
	)