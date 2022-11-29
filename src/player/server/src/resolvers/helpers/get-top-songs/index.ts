import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PoolOrClient, addPrefix, convertTableToCamelCase, query } from "@oly_op/pg-helpers";

import { SELECT_SONGS_TOP_PLAYED } from "../../../sql";
import { Song } from "../../../types";

export const getTopSongs = (client: PoolOrClient) => (limit: number) =>
	query(client)(SELECT_SONGS_TOP_PLAYED)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			limit: [limit],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
		},
	});
