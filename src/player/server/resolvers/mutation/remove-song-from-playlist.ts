import { PlaylistIDBase, SongIDBase } from "@oly_op/music-app-common/types"
import { join, convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers"

import { Playlist } from "../../types"
import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { DELETE_PLAYLIST_SONG, SELECT_PLAYLIST_BY_ID } from "../../sql"

interface Args
	extends SongIDBase, PlaylistIDBase {}

const resolver =
	createResolver()

export const removeSongFromPlaylist =
	resolver<Playlist, Args>(
		async ({ args, context }) => {
			const { songID, playlistID } = args

			await query(context.pg)(DELETE_PLAYLIST_SONG)({
				variables: { songID, playlistID },
			})

			return query(context.pg)(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCase(),
				variables: [{
					key: "playlistID",
					value: args.playlistID,
				},{
					key: "columnNames",
					value: join(COLUMN_NAMES.PLAYLIST),
				}],
			})
		},
	)