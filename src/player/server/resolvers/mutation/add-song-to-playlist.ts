import {
	join,
	getResultExists,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	ForbiddenError,
	UserInputError,
} from "apollo-server-fastify"

import pipe from "@oly_op/pipe"
import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"

import {
	EXISTS_PLAYLIST_SONG,
	INSERT_PLAYLIST_SONG,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { Playlist } from "../../types"
import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

const resolver =
	createResolver()

interface Args
	extends SongIDBase, PlaylistIDBase {}

export const addSongToPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { songID, playlistID } = args
			const query = pgHelpersQuery(context.pg)
			const { userID } = context.authorization!
			const exists = pgHelpersExists(context.pg)

			const songExists =
				await exists({
					value: songID,
					table: "songs",
					column: "song_id",
				})

			if (!songExists) {
				throw new UserInputError("Song does not exist.")
			}

			const playlistExists =
				await exists({
					value: playlistID,
					table: "playlists",
					column: "playlist_id",
				})

			if (!playlistExists) {
				throw new UserInputError("Playlist does not exist.")
			}

			const isUsersPlaylist =
				await query(SELECT_PLAYLIST_BY_ID)({
					parse: pipe(
						convertFirstRowToCamelCase<Playlist>(),
						playlist => playlist.userID === userID,
					),
					variables: {
						playlistID,
						columnNames: "user_id",
					},
				})

			if (!isUsersPlaylist) {
				throw new ForbiddenError("Unauthorized to add to playlist.")
			}

			const inPlaylist =
				await query(EXISTS_PLAYLIST_SONG)({
					parse: getResultExists,
					variables: { songID, playlistID },
				})

			if (inPlaylist) {
				throw new UserInputError("Song is already in playlist.")
			}

			await query(INSERT_PLAYLIST_SONG)({
				variables: { songID, playlistID },
			})

			return query(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCase<Playlist>(),
				variables: {
					playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})
		},
	)