import { v4 as createUUID } from "uuid"
import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { join, query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { Playlist } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_PLAYLIST, INSERT_LIBRARY_OBJECT } from "../../sql"

type Args =
	InterfaceWithInput<Pick<Playlist, "title" | "isPublic">>

export const createPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const playlistID = createUUID()
			const { input: { title, isPublic } } = args

			const playlist =
				await query(context.pg)(INSERT_PLAYLIST)({
					parse: convertFirstRowToCamelCase<Playlist>(),
					variables: [{
						key: "isPublic",
						value: isPublic,
					},{
						key: "playlistID",
						value: playlistID,
					},{
						key: "title",
						value: title,
						parameterized: true,
					},{
						key: "columnNames",
						value: join(COLUMN_NAMES.PLAYLIST),
					},{
						key: "userID",
						value: context.authorization!.userID,
					}],
				})

			if (isPublic) {
				await context.ag.saveObject({
					text: title,
					typeName: "Playlist",
					objectID: playlistID,
				})
			}

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