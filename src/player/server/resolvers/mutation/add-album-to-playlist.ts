import {
	join,
	exists as pgExists,
	query as pgHelpersQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { ForbiddenError, UserInputError } from "apollo-server-fastify"
import { AlbumIDBase, PlaylistIDBase } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Playlist } from "../../types"
import { SELECT_ALBUM_SONGS } from "../../sql"
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers"

interface Args
	extends AlbumIDBase, PlaylistIDBase {}

export const addAlbumToPlaylist =
	resolver<Playlist, Args>(
		async ({ parent, context, args }) => {
			const query = pgHelpersQuery(context.pg)
			const exists = pgExists(context.pg)
			const { albumID, playlistID } = args
			const { userID } = context.authorization!

			const albumExists =
				await exists({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist.")
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
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			await Promise.all(
				songs.map(
					({ songID }) => (
						addSongToPlaylist(context.pg)({
							songID,
							playlistID,
						})
					),
				),
			)

			return getPlaylist(context.pg)({ playlistID })
		},
	)