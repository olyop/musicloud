import {
	exists,
	PoolOrClient,
	query as pgHelpersQuery,
} from "@oly_op/pg-helpers"

import { isNull } from "lodash"
import { v4 as createUUID } from "uuid"
import { UserIDBase } from "@oly_op/music-app-common/types"

import {
	INSERT_PLAY,
	INSERT_NOW_PLAYING,
	DELETE_QUEUE_NOW_PLAYING,
	UPDATE_QUEUE_NOW_PLAYING,
} from "../../sql"

import { COLUMN_NAMES } from "../../globals"

export interface UpdateQueueNowPlayingOptions
	extends UserIDBase { value: string | null }

export const updateQueueNowPlaying =
	(client: PoolOrClient) =>
		async (options: UpdateQueueNowPlayingOptions) => {
			const { userID, value } = options

			const query = pgHelpersQuery(client)

			if (isNull(value)) {
				await query(DELETE_QUEUE_NOW_PLAYING)({
					variables: { userID },
				})
			} else {
				const doesUserHaveNowPlaying =
					await exists(client)({
						value: userID,
						table: "now_playing",
						column: COLUMN_NAMES.USER[0],
					})

				if (doesUserHaveNowPlaying) {
					await query(UPDATE_QUEUE_NOW_PLAYING)({
						variables: { userID, songID: value },
					})
				} else {
					await query(INSERT_NOW_PLAYING)({
						variables: { userID, songID: value },
					})
				}

				await query(INSERT_PLAY)({
					variables: {
						userID,
						songID: value,
						playID: createUUID(),
					},
				})
			}
		}