import {
	exists,
	PoolOrClient,
	query as pgHelpersQuery,
} from "@oly_op/pg-helpers"

import { isNull } from "lodash"
import { SearchIndex } from "algoliasearch"
import { UserID } from "@oly_op/music-app-common/types"

import {
	INSERT_PLAY,
	INSERT_NOW_PLAYING,
	DELETE_QUEUE_NOW_PLAYING,
	UPDATE_QUEUE_NOW_PLAYING,
} from "../../sql"

import { COLUMN_NAMES } from "../../globals"

export interface UpdateQueueNowPlayingOptions
	extends UserID { value: string | null }

export const updateQueueNowPlaying =
	(pg: PoolOrClient, ag?: SearchIndex) =>
		async (options: UpdateQueueNowPlayingOptions) => {
			const { userID, value } = options

			const query = pgHelpersQuery(pg)

			if (isNull(value)) {
				await query(DELETE_QUEUE_NOW_PLAYING)({
					variables: { userID },
				})
			} else {
				const doesUserHaveNowPlaying =
					await exists(pg)({
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
					},
				})

				if (ag) {
					await ag.partialUpdateObject({
						objectID: value,
						plays: {
							value: 1,
							_operation: "Increment",
						},
					})
				}
			}
		}