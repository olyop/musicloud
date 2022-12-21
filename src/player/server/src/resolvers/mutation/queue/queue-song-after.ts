import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import { exists, query } from "@oly_op/pg-helpers";

import { getQueueLength, insertQueueSong } from "../../helpers";
import resolver from "../resolver";

export const queueSongAfter = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const client = await context.pg.connect();

	try {
		await query(client)("BEGIN")();

		const songExists = await exists(client)({
			value: songID,
			table: "songs",
			column: COLUMN_NAMES.SONG[0],
		});

		if (!songExists) {
			throw new Error("Song does not exist");
		}

		const nextsLength = await getQueueLength(client)({
			userID,
			tableName: "queue_nexts",
		});

		await insertQueueSong(client)({
			userID,
			songID,
			index: nextsLength,
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
