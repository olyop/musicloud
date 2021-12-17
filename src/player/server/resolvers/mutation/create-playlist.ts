import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { join, query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_PLAYLIST, INSERT_LIBRARY_OBJECT } from "../../sql"

type Args =
	InterfaceWithInput<Pick<Playlist, "title" | "privacy">>

export const createPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { userID } = context.authorization!
			const { input: { title, privacy } } = args

			const playlist =
				await query(context.pg)(INSERT_PLAYLIST)({
					log: { sql: true },
					parse: convertFirstRowToCamelCase<Playlist>(),
					variables: [{
						key: "title",
						value: title,
						parameterized: true,
					},{
						key: "privacy",
						value: privacy.toLowerCase(),
					},{
						key: "columnNames",
						value: join(COLUMN_NAMES.PLAYLIST),
					},{
						key: "userID",
						value: userID,
					}],
				})

			const { playlistID } = playlist

			await context.ag.saveObject({
				userID,
				privacy,
				text: title,
				typeName: "Playlist",
				objectID: playlistID,
			})

			await query(context.pg)(INSERT_LIBRARY_OBJECT)({
				variables: {
					inLibrary: true,
					objectID: playlist.playlistID,
					tableName: "library_playlists",
					columnName: COLUMN_NAMES.PLAYLIST[0],
					userID: context.authorization!.userID,
				},
			})

			return playlist
		},
	)