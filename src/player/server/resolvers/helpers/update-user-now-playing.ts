import {
	query,
	PoolOrClient,
	convertFirstRowToCamelCase,
	join,
} from "@oly_op/pg-helpers"

import { v4 as createUUID } from "uuid"

import {
	INSERT_PLAY,
	SELECT_USER_BY_ID,
	UPDATE_USER_NOW_PLAYING,
} from "../../sql"

import { User } from "../../types"
import { COLUMN_NAMES } from "../../globals"

export const updateUserNowPlaying =
	(client: PoolOrClient) =>
		async (userID: string, songID: string | null) => {
			if (songID) {
				await query(client)(INSERT_PLAY)({
					variables: {
						songID,
						userID,
						playID: createUUID(),
					},
				})
				return query(client)(UPDATE_USER_NOW_PLAYING)({
					parse: convertFirstRowToCamelCase<User>(),
					variables: {
						userID,
						songID,
						columnNames: join(COLUMN_NAMES.USER),
					},
				})
			} else {
				return query(client)(SELECT_USER_BY_ID)({
					parse: convertFirstRowToCamelCase<User>(),
					variables: {
						userID,
						columnNames: join(COLUMN_NAMES.USER),
					},
				})
			}
		}