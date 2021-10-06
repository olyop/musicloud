import { join as lodashJoin } from "lodash"
import { query, PoolOrClient, join, convertTableToCamelCase } from "@oly_op/pg-helpers"

import { Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE_SONGS_FROM_IDS } from "../../sql"

export const getQueueSongsFromIDs =
	(client: PoolOrClient) =>
		(tableName: string, songIDs: string[]) =>
			query(client)(SELECT_QUEUE_SONGS_FROM_IDS)({
				parse: convertTableToCamelCase<Song>(),
				variables: {
					tableName,
					songIDs: `'${lodashJoin(songIDs, "', '")}'`,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})