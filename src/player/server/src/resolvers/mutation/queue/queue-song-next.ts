import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import { exists, query } from "@oly_op/pg-helpers";

import { crementQueueSongIndex, getQueueSection, insertQueueSong } from "../../helpers/index.js";
import resolver from "../resolver.js";

export const queueSongNext = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const client = await context.pg.connect();

	const songExists = await exists(client)({
		value: songID,
		table: "songs",
		column: COLUMN_NAMES.SONG[0],
	});

	if (!songExists) {
		throw new Error("Song does not exist");
	}

	try {
		await query(client)("BEGIN")();

		const nexts = await getQueueSection(client)({
			userID,
			tableName: "queue_nexts",
		});

		if (nexts) {
			for (const next of nexts) {
				await crementQueueSongIndex(client)(true, {
					userID,
					index: next.index,
					tableName: "queue_nexts",
				});
			}
		}

		await insertQueueSong(client)({
			userID,
			songID,
			index: 0,
			tableName: "queue_nexts",
		});

		await query(client)("COMMIT")();
	} catch (error) {
		await query(client)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
