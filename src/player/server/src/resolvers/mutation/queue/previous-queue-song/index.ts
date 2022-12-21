import { query } from "@oly_op/pg-helpers";
import { isNull } from "lodash-es";

import { QueueSong } from "../../../../types";
import {
	crementQueueSongIndex,
	deleteQueueSong,
	getQueue,
	getQueueSong,
	insertQueueSong,
	updateQueueNowPlaying,
} from "../../../helpers";
import resolver from "../../resolver";

export const previousQueueSong = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	const client = await context.pg.connect();

	try {
		await query(context.pg)("BEGIN")();

		const { previous, nowPlaying, next, later } = await getQueue(client)({ userID });

		if (!isNull(nowPlaying) && !isNull(previous)) {
			const newNowPlaying = await getQueueSong(client)({
				userID,
				index: previous.length - 1,
				tableName: "queue_previous",
			});

			await deleteQueueSong(client)({
				userID,
				index: previous.length - 1,
				tableName: "queue_previous",
			});

			const queueToBeEdited = (isNull(next) ? later : next)!;
			const queueToBeEditedName = isNull(next) ? "later" : "next";

			const queueSongsToBeEdited = queueToBeEdited
				.filter(({ index }) => index !== 0)
				.map(({ index }: QueueSong) =>
					crementQueueSongIndex(client)(true, {
						index,
						userID,
						tableName: `queue_${queueToBeEditedName}s`,
					}),
				);

			const insertNowPlayingIntoQueue = insertQueueSong(client)({
				userID,
				index: 0,
				songID: nowPlaying.songID,
				tableName: `queue_${queueToBeEditedName}s`,
			});

			const updateNowPlaying = updateQueueNowPlaying(
				client,
				context.ag.index,
			)({
				userID,
				value: newNowPlaying.songID,
			});

			await Promise.all([...queueSongsToBeEdited, insertNowPlayingIntoQueue, updateNowPlaying]);
		}

		await query(context.pg)("COMMIT")();
	} catch (error) {
		await query(context.pg)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
