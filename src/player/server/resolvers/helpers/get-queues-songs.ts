import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"

import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE_SONGS } from "../../sql"
import { addQueueIndexToSongs } from "./add-queue-index-to-songs"

export const getQueueSongs =
	(client: PoolOrClient) =>
		(userID: string) =>
			(tableName: string) =>
				query(client)(SELECT_QUEUE_SONGS)({
					parse: pipe(
						convertTableToCamelCase<Song>(),
						addQueueIndexToSongs,
					),
					variables: {
						userID,
						tableName,
						columnNames: join(COLUMN_NAMES.SONG, "songs"),
					},
				})