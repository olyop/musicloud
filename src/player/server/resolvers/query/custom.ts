import {
	join,
	query,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { Album } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_ALBUMS_TRENDING } from "../../sql"
import { createResolver, getTopSongs } from "../helpers"

const resolver =
	createResolver()

export const topTenSongs =
	resolver(
		({ context }) => (
			getTopSongs(context.pg)(10)
		),
	)

export const topOneHundredSongs =
	resolver(
		({ context }) => (
			getTopSongs(context.pg)(100)
		),
	)

export const trendingAlbums =
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