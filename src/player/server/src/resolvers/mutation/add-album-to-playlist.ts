import {
	join,
	convertTableToCamelCase,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers"

import { last } from "lodash-es"
import { AlbumID, PlaylistID } from "@oly_op/musicloud-common/build/types"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Playlist, PlaylistSong } from "../../types"
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers"
import { SELECT_ALBUM_SONGS, SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql"

interface Args
	extends AlbumID, PlaylistID {}

export const addAlbumToPlaylist =
	resolver<Playlist, Args>(
		async ({ context, args }) => {
			const query = pgHelpersQuery(context.pg)
			const exists = pgHelpersExists(context.pg)
			const { albumID, playlistID } = args
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)

			const albumExists =
				await exists({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new Error("Album does not exist")
			}

			const playlistExists =
				await exists({
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

			const songs =
				await query(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID,
						columnNames: COLUMN_NAMES.SONG[0],
					},
				})

			const playlistSongs =
				await query(SELECT_PLAYLIST_SONGS_RELATIONS)({
					parse: convertTableToCamelCase<PlaylistSong>(),
					variables: {
						playlistID,
						columnNames: join(COLUMN_NAMES.PLAYLIST_SONG),
					},
				})

			const lastPlaylistSong =
				last(playlistSongs)

			const baseIndex =
				lastPlaylistSong ?
					lastPlaylistSong.index + 1 :
					0

			await Promise.all(
				songs.map(
					({ songID }, index) => (
						addSongToPlaylist(context.pg)({
							songID,
							playlistID,
							index: baseIndex + index,
						})
					),
				),
			)

			return getPlaylist(context.pg)({ playlistID })
		},
	)