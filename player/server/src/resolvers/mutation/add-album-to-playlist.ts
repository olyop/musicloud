import {
	join,
	convertTableToCamelCase,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers"

import { last } from "lodash-es"
import { AlbumID, PlaylistID } from "@oly_op/musicloud-common"
import { ForbiddenError, UserInputError } from "apollo-server-fastify"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Playlist, PlaylistSong } from "../../types"
import { SELECT_ALBUM_SONGS, SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql"
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers"

interface Args
	extends AlbumID, PlaylistID {}

export const addAlbumToPlaylist =
	resolver<Playlist, Args>(
		async ({ context, args }) => {
			const query = pgHelpersQuery(context.pg)
			const exists = pgHelpersExists(context.pg)
			const { albumID, playlistID } = args
			const { userID } = context.authorization!

			const albumExists =
				await exists({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist")
			}

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
				throw new ForbiddenError("Unauthorized to add to playlist")
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