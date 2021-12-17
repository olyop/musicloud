import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { ForbiddenError, UserInputError } from "apollo-server-fastify"
import { convertFirstRowToCamelCase, exists, join, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { isNotUsersPlaylist } from "../helpers"
import { UPDATE_PLAYLIST_PRIVACY } from "../../sql"

export const updatePlaylistPrivacy =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { userID } = context.authorization!
			const { playlistID, privacy } = args.input

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
				throw new ForbiddenError("Unauthorized to update playlist")
			}

			return query(context.pg)(UPDATE_PLAYLIST_PRIVACY)({
				parse: convertFirstRowToCamelCase<Playlist>(),
				variables: {
					playlistID,
					privacy: privacy.toLowerCase(),
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})
		},
	)

type Input =
	Pick<Playlist, "playlistID" | "privacy">

type Args =
	InterfaceWithInput<Input>