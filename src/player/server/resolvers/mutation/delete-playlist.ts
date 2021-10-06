import {
	join,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	ForbiddenError,
	UserInputError,
} from "apollo-server-fastify"

import pipe from "@oly_op/pipe"
import { PlaylistIDBase } from "@oly_op/music-app-common/types"

import {
	SELECT_USER_BY_ID,
	DELETE_PLAYLIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { User, Playlist } from "../../types"

const resolver =
	createResolver()

export const deletePlaylist =
	resolver<User, PlaylistIDBase>(
		async ({ args, context }) => {
			const { playlistID } = args
			const { userID } = context.authorization!

			const query = pgHelpersQuery(context.pg)
			const exists = pgHelpersExists(context.pg)

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
						columnNames: "*",
					},
				})

			if (!isUsersPlaylist) {
				throw new ForbiddenError("Unauthorized to delete playlist.")
			}

			await query(DELETE_PLAYLIST_BY_ID)({
				variables: { playlistID },
			})

			return query(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})
		},
	)