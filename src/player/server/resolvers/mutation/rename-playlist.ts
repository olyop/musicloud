import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { ForbiddenError, UserInputError } from "apollo-server-fastify"
import { join, query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { isNotUsersPlaylist } from "../helpers"
import { UPDATE_PLAYLIST_TITLE } from "../../sql"

type Args =
	InterfaceWithInput<Pick<Playlist, "playlistID" | "title">>

export const renamePlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { title, playlistID } = args.input
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
				throw new ForbiddenError("Unauthorized to delete playlist")
			}

			await context.ag.partialUpdateObject({
				text: title,
				typeName: "Playlist",
				objectID: playlistID,
			})

			return query(context.pg)(UPDATE_PLAYLIST_TITLE)({
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