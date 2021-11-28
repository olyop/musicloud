import {
	join,
	query,
	PoolOrClient,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { UserIDBase } from "@oly_op/music-app-common/types"

import { NowPlaying } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_QUEUE_NOW_PLAYING } from "../../sql"

export const getQueueNowPlaying =
	(client: PoolOrClient) =>
		({ userID }: UserIDBase) =>
			query(client)(SELECT_QUEUE_NOW_PLAYING)({
				parse: convertFirstRowToCamelCaseOrNull<NowPlaying>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.NOW_PLAYING),
				},
			})