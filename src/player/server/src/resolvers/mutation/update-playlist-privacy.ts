import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types"
import { convertFirstRowToCamelCase, exists, join, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { isNotUsersPlaylist } from "../helpers"
import { UPDATE_PLAYLIST_PRIVACY } from "../../sql"

type Input =
	Pick<Playlist, "playlistID" | "privacy">

export const updatePlaylistPrivacy =
	resolver<Playlist, InterfaceWithInput<Input>>(
		async ({ args, context }) => {
			const { userID } = context.getAuthorizationJWTPayload(context.authorization)
			const { playlistID, privacy } = args.input

			const playlistExists =
				await exists(context.pg)({
					value: playlistID,
					table: "playlists",
					column: COLUMN_NAMES.PLAYLIST[0],
				})

			if (!playlistExists) {
				throw new Error("Playlist does not exist")
			}

			if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
				throw new Error("Unauthorized to update playlist")
			}

			const algoliaRecordUpdate: Partial<AlgoliaRecordPlaylist> = {
				privacy,
				objectID: playlistID,
			}

			await context.ag.index.partialUpdateObject(algoliaRecordUpdate)

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