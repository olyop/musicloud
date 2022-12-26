import { query } from "@oly_op/pg-helpers";
import { head, isNull } from "lodash-es";

import { QueueSong } from "../../../../types/index.js";
import {
	crementQueueSongIndex,
	deleteQueueSong,
	getQueue,
	getQueueSong,
	insertQueueSong,
	updateQueueNowPlaying,
} from "../../../helpers/index.js";
import resolver from "../../resolver.js";

export const nextQueueSong = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	const client = await context.pg.connect();

	try {
		await query(client)("BEGIN")();

		const { previous, nowPlaying, next, later } = await getQueue(client)({ userID });

		if (!isNull(nowPlaying) && (!isNull(next) || !isNull(later))) {
			const queueToBeEdited = (isNull(next) ? later : next)!;

			const tableName = isNull(next) ? "queue_laters" : "queue_nexts";

			if (head(queueToBeEdited)?.index !== 0) {
				throw new Error("Invalid queue");
			}

			const newNowPlaying = await getQueueSong(client)({
				userID,
				index: 0,
				tableName,
			});

			await deleteQueueSong(client)({
				userID,
				index: 0,
				tableName,
			});

			const queueSongsToBeEdited = queueToBeEdited
				.filter(({ index }) => index !== 0)
				.map(({ index }: QueueSong) =>
					crementQueueSongIndex(client)(false, {
						userID,
						index,
						tableName,
					}),
				);

			const insertNowPlayingIntoPrevious = insertQueueSong(client)({
				userID,
				songID: nowPlaying.songID,
				tableName: "queue_previous",
				index: isNull(previous) ? 0 : previous.length,
			});

			const updateNowPlaying = updateQueueNowPlaying(
				client,
				context.ag.index,
			)({
				userID,
				value: newNowPlaying.songID,
			});

			await Promise.all([...queueSongsToBeEdited, insertNowPlayingIntoPrevious, updateNowPlaying]);
		}

		await query(client)("COMMIT")();
	} catch (error) {
		await query(client)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
