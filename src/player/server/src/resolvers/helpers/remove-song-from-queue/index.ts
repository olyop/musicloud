import { UserID } from "@oly_op/musicloud-common/build/types";
import { getResultExists, importSQL, query } from "@oly_op/pg-helpers";
import { Pool } from "pg";

import { IndexOptions, TableNameOptions } from "../../../types";
import { getQueueSection } from "../get-queue-section";

const isf = importSQL(import.meta.url);

const DELETE_QUEUE_SONG = await isf("delete-queue-song");
const EXISTS_QUEUE_SONG = await isf("exists-queue-song");
const UPDATE_QUEUE_SONG_CREMENT_INDEX = await isf("update-queue-song-crement-index");

export const removeSongFromQueue = (pool: Pool) => async (options: RemoveSongFromQueueOptions) => {
	const { userID, tableName, index } = options;

	const client = await pool.connect();

	const queueSongExists = await query(pool)(EXISTS_QUEUE_SONG)({
		parse: getResultExists,
		variables: {
			index,
			userID,
			tableName: [tableName],
		},
	});

	if (!queueSongExists) {
		throw new Error("Queue song does not exist");
	}

	try {
		await query(pool)("BEGIN")();

		const queueSongs = await getQueueSection(pool)({ userID, tableName });

		if (queueSongs) {
			const queueSongsAfter = queueSongs.slice(index + 1);

			await query(pool)(DELETE_QUEUE_SONG)({
				variables: {
					index,
					userID,
					tableName: [tableName],
				},
			});

			for (const queueSong of queueSongsAfter) {
				await query(pool)(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
					variables: {
						userID,
						crement: ["-"],
						index: queueSong.index,
						tableName: [tableName],
					},
				});
			}
		}

		await query(pool)("COMMIT")();
	} catch (error) {
		await query(pool)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
};

export interface RemoveSongFromQueueOptions extends UserID, IndexOptions, TableNameOptions {}
