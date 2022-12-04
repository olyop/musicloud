import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Song } from "../../../types";

const SELECT_SONGS_TOP_PLAYED = await importSQL(import.meta.url)("select-songs-top-played");

export const getTopSongs = (client: PoolOrClient) => (limit: number) =>
	query(client)(SELECT_SONGS_TOP_PLAYED)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			limit: [limit],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
		},
	});
