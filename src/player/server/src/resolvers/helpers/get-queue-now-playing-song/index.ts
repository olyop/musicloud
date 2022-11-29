import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCaseOrNull,
	query,
} from "@oly_op/pg-helpers";

import { SELECT_QUEUE_NOW_PLAYING_SONG } from "../../../sql";
import { Song } from "../../../types";

export const getQueueNowPlayingSong =
	(pg: PoolOrClient) =>
	({ userID }: UserID) =>
		query(pg)(SELECT_QUEUE_NOW_PLAYING_SONG)({
			parse: convertFirstRowToCamelCaseOrNull<Song>(),
			variables: {
				userID,
				columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			},
		});
