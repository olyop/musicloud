import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { addPrefix, convertFirstRowToCamelCase, query as pgHelpersQuery } from "@oly_op/pg-helpers";
import { isNull } from "lodash-es";

import {
	DELETE_QUEUE_SONG,
	INSERT_QUEUE_SONG,
	SELECT_QUEUE_SONG,
	UPDATE_QUEUE_SONG_CREMENT_INDEX,
} from "../../../sql";
import { QueueSong } from "../../../types";
import { getQueue, updateQueueNowPlaying } from "../../helpers";
import resolver from "../resolver";

export const previousQueueSong = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	const client = await context.pg.connect();
	const query = pgHelpersQuery(client);

	try {
		await query("BEGIN")();

		const { previous, nowPlaying, next, later } = await getQueue(client)({ userID });

		if (!isNull(nowPlaying) && !isNull(previous)) {
			const newNowPlaying = await query(SELECT_QUEUE_SONG)({
				parse: convertFirstRowToCamelCase<QueueSong>(),
				variables: {
					userID,
					index: previous.length - 1,
					tableName: ["queue_previous"],
					columnNames: addPrefix(COLUMN_NAMES.QUEUE_SONG),
				},
			});

			await query(DELETE_QUEUE_SONG)({
				variables: {
					userID,
					index: previous.length - 1,
					tableName: ["queue_previous"],
				},
			});

			const queueToBeEdited = (isNull(next) ? later : next)!;

			const queueToBedEditedName = isNull(next) ? "later" : "next";

			if (!isNull(next) || !isNull(later)) {
				for (const queue of queueToBeEdited) {
					await query(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
						variables: {
							userID,
							crement: ["+"],
							index: queue.index,
							tableName: [`queue_${queueToBedEditedName}s`],
						},
					});
				}
			}

			await query(INSERT_QUEUE_SONG)({
				variables: {
					userID,
					index: 0,
					songID: nowPlaying.songID,
					tableName: [`queue_${queueToBedEditedName}s`],
				},
			});

			await updateQueueNowPlaying(
				client,
				context.ag.index,
			)({
				userID,
				value: newNowPlaying.songID,
			});
		}

		await query("COMMIT")();
	} catch (error) {
		await query("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
