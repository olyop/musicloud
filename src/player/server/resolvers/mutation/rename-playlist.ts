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
	SELECT_PLAYLIST_BY_ID,
	UPDATE_PLAYLIST_TITLE,
} from "../../sql"

import { Playlist } from "../../types"
import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

interface Args
	extends PlaylistIDBase, Pick<Playlist, "title"> {}

const resolver =
	createResolver()

export const renamePlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { title, playlistID } = args
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

			await context.ag.partialUpdateObject({
				text: title,
				typeName: "Playlist",
				objectID: playlistID,
			})

			return query(UPDATE_PLAYLIST_TITLE)({
				parse: convertFirstRowToCamelCase(),
				variables: [{
					key: "playlistID",
					value: playlistID,
				},{
					key: "title",
					value: title,
					parameterized: true,
				},{
					key: "columnNames",
					value: join(COLUMN_NAMES.PLAYLIST),
				}],
			})
		},
	)