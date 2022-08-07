import {
	join,
	query,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { getTopSongs } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { Album, Playlist } from "../../types"
import { SELECT_ALBUMS_TRENDING, SELECT_PLAYLISTS_TRENDING } from "../../sql"

export const getTopTenSongs =
	resolver(
		({ context }) => (
			getTopSongs(context.pg)(10)
		),
	)

export const getTopOneHundredSongs =
	resolver(
		({ context }) => (
			getTopSongs(context.pg)(100)
		),
	)

export const getTrendingAlbums =
	resolver<Album[]>(
		({ context }) => (
			query(context.pg)(SELECT_ALBUMS_TRENDING)({
				parse: convertTableToCamelCase(),
				variables: {
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})
		),
	)

export const getTrendingPlaylists =
	resolver<Playlist[]>(
		({ context }) => (
			query(context.pg)(SELECT_PLAYLISTS_TRENDING)({
				parse: convertTableToCamelCase(),
				variables: {
					columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
				},
			})
		),
	)