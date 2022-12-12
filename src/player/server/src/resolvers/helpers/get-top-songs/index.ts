import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCaseOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Song } from "../../../types";

const SELECT_TOP_SONGS = await importSQL(import.meta.url)("select-top-songs");

export const getTopSongs = (pg: PoolOrClient) => (limit: number) =>
	query(pg)(SELECT_TOP_SONGS)({
		parse: convertTableToCamelCaseOrNull<Song>(),
		variables: {
			limit: [limit],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
		},
	});
