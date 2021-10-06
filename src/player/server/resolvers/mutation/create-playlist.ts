import { v4 as createUUID } from "uuid"
import { join, query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { Playlist } from "../../types"
import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_PLAYLIST, INSERT_LIBRARY_OBJECT } from "../../sql"

const resolver =
	createResolver()

interface Args {
	playlist: Pick<Playlist, "title">,
}

export const createPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const playlistID = createUUID()
			const { playlist: { title } } = args

			const playlist =
				await query(context.pg)(INSERT_PLAYLIST)({
					parse: convertFirstRowToCamelCase<Playlist>(),
					variables: [{
						key: "title",
						value: title,
						parameterized: true,
					},{
						key: "playlistID",
						value: playlistID,
					},{
						key: "columnNames",
						value: join(COLUMN_NAMES.PLAYLIST),
					},{
						key: "userID",
						value: context.authorization!.userID,
					}],
				})

			await context.ag.saveObject({
				text: title,
				typeName: "Playlist",
				objectID: playlistID,
			})

			await query(context.pg)(INSERT_LIBRARY_OBJECT)({
				variables: {
					inLibrary: true,
					columnName: "playlist_id",
					objectID: playlist.playlistID,
					tableName: "library_playlists",
					userID: context.authorization!.userID,
				},
			})

			return playlist
		},
	)