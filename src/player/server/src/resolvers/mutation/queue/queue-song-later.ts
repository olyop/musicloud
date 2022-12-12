import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import { exists as pgExists, query as pgHelpersQuery } from "@oly_op/pg-helpers";

import { getQueueSection, insertQueueSong } from "../../helpers";
import resolver from "../resolver";

export const queueSongLater = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const client = await context.pg.connect();
	const query = pgHelpersQuery(client);
	const exists = pgExists(client);

	try {
		await query("BEGIN")();

		const songExists = await exists({
			value: songID,
			table: "songs",
			column: COLUMN_NAMES.SONG[0],
		});

		if (!songExists) {
			throw new Error("Song does not exist");
		}

		const nexts = await getQueueSection(context.pg)({
			userID,
			tableName: "queue_laters",
		});

		if (nexts) {
			await insertQueueSong(context.pg)({
				userID,
				songID,
				index: nexts.length,
				tableName: "queue_laters",
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
