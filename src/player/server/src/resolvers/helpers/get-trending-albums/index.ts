import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCase,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Album } from "../../../types";

const SELECT_ALBUMS_TRENDING = await importSQL(import.meta.url)("select-albums-trending");

export const getTrendingAlbums = (client: PoolOrClient) => (limit: number) =>
	query(client)(SELECT_ALBUMS_TRENDING)({
		parse: convertTableToCamelCase<Album>(),
		variables: {
			limit: [limit],
			columnNames: addPrefix(COLUMN_NAMES.ALBUM, "albums"),
		},
	});
