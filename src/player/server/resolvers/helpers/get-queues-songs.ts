import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { pipe } from "rxjs"
import { UserID } from "@oly_op/music-app-common/types"

import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE_SONGS } from "../../sql"
import { Song, TableNameOptions } from "../../types"

export const addQueueIndexToSongs =
	(songs: Song[]) =>
		songs.map<Song>(
			(song, queueIndex) => ({
				...song,
				queueIndex,
			}),
		)

export interface GetQueueSongsOptions
	extends UserID, TableNameOptions {
	limit?: number,
}

export const getQueueSongs =
	(client: PoolOrClient) =>
		({ limit, userID, tableName }: GetQueueSongsOptions) =>
			query(client)(SELECT_QUEUE_SONGS)({
				parse: pipe(
					convertTableToCamelCase<Song>(),
					addQueueIndexToSongs,
				),
				variables: {
					userID,
					tableName,
					limit: limit || "ALL",
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})