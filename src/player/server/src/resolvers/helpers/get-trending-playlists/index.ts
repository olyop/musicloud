import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Playlist } from "../../../types/index.js";

const SELECT_PLAYLISTS_TRENDING = await importSQL(import.meta.url)("select-playlists-trending");

export const getTrendingPlaylists = (client: PoolOrClient) => (limit: number) =>
	query(client)(SELECT_PLAYLISTS_TRENDING)({
		parse: convertTableToCamelCase<Playlist>(),
		variables: {
			limit: [limit],
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
		},
	});
