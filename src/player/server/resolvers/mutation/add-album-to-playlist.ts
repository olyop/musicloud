import {
	join,
	getResultExists,
	query as pgQuery,
	exists as pgExists,
	convertTableToCamelCase,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	ForbiddenError,
	UserInputError,
} from "apollo-server-fastify"

import pipe from "@oly_op/pipe"
import { AlbumIDBase, PlaylistIDBase } from "@oly_op/music-app-common/types"

import {
	SELECT_ALBUM_SONGS,
	EXISTS_PLAYLIST_SONG,
	INSERT_PLAYLIST_SONG,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { createResolver } from "../helpers"
import { Song, Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"

interface Args
	extends AlbumIDBase, PlaylistIDBase {}

const resolver =
	createResolver()

export const addAlbumToPlaylist =
	resolver<Playlist, Args>(
		async ({ parent, context, args }) => {
			const query = pgQuery(context.pg)
			const exists = pgExists(context.pg)
			const { albumID, playlistID } = args
			const { userID } = context.authorization!

			const albumExists =
				await exists({
					value: albumID,
					table: "albums",
					column: "album_id",
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist.")
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

			const songs =
				await query(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID,
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const { songID } of songs) {
				const inPlaylist =
					await query(EXISTS_PLAYLIST_SONG)({
						parse: getResultExists,
						variables: { songID, playlistID },
					})

				if (!inPlaylist) {
					await query(INSERT_PLAYLIST_SONG)({
						variables: { songID, playlistID },
					})
				}
			}

			return query(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCase(),
				variables: [{
					key: "playlistID",
					value: playlistID,
				},{
					key: "columnNames",
					value: join(COLUMN_NAMES.PLAYLIST),
				}],
			})
		},
	)