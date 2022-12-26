import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient } from "@oly_op/pg-helpers";

import { IndexOptions, TableNameOptions } from "../../../types/index.js";
import { crementQueueSongIndex } from "../crement-queue-song-index/index.js";
import { deleteQueueSong } from "../delete-queue-song/index.js";
import { existsQueueSong } from "../exists-queue-song/index.js";
import { getQueueSection } from "../get-queue-section/index.js";

export const removeSongFromQueue = (pg: PoolOrClient) => async (options: Options) => {
	const { userID, tableName, index } = options;

	const queueSongExists = await existsQueueSong(pg)({
		index,
		userID,
		tableName,
	});

	if (!queueSongExists) {
		throw new Error("Queue song does not exist");
	}

	const queueSongs = await getQueueSection(pg)({ userID, tableName });

	if (queueSongs) {
		const queueSongsAfter = queueSongs.slice(index + 1);

		const deleteCurrentQueueSong = deleteQueueSong(pg)({
			index,
			userID,
			tableName,
		});

		const updateQueueSongsAfter = queueSongsAfter.map(queueSong =>
			crementQueueSongIndex(pg)(false, {
				userID,
				tableName,
				index: queueSong.index,
			}),
		);

		await Promise.all([deleteCurrentQueueSong, ...updateQueueSongsAfter]);
	}
};

interface Options extends UserID, IndexOptions, TableNameOptions {}
