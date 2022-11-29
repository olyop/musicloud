import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCaseOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { NowPlaying } from "../../../types";

const SELECT_NOW_PLAYING = await importSQL(import.meta.url)("select-now-playing");

export const getQueueNowPlaying =
	(client: PoolOrClient) =>
	({ userID }: UserID) =>
		query(client)(SELECT_NOW_PLAYING)({
			parse: convertFirstRowToCamelCaseOrNull<NowPlaying>(),
			variables: {
				userID,
				columnNames: addPrefix(COLUMN_NAMES.NOW_PLAYING),
			},
		});
