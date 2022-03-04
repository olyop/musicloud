import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_SONGS_TOP_PLAYED } from "../../sql"

export const getTopSongs =
	(client: PoolOrClient) =>
		(limit: number) =>
			query(client)(SELECT_SONGS_TOP_PLAYED)({
				parse: convertTableToCamelCase<Song>(),
				variables: {
					limit,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})