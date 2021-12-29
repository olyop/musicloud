import { exists } from "@oly_op/pg-helpers"

import { ForbiddenError, UserInputError } from "apollo-server-fastify"
import { PlaylistID, SongID } from "@oly_op/music-app-common/types"

import {
	getPlaylist,
	isNotUsersPlaylist,
	addSongToPlaylist as addSongToPlaylistHelper,
} from "../helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"

interface Args
	extends SongID, PlaylistID {}

export const addSongToPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { songID, playlistID } = args
			const { userID } = context.authorization!

			const playlistExists =
				await exists(context.pg)({
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

			const songExists =
				await exists(context.pg)({
					value: songID,
					table: "songs",
					column: COLUMN_NAMES.SONG[0],
				})

			if (!songExists) {
				throw new UserInputError("Song does not exist")
			}

			await addSongToPlaylistHelper(context.pg)({ songID, playlistID })

			return getPlaylist(context.pg)({ playlistID })
		},
	)