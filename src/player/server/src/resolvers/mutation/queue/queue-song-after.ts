import {
	getResultRowCount,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers";

import { SongID } from "@oly_op/musicloud-common/build/types";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";

import resolver from "../resolver";
import { SELECT_QUEUE, INSERT_QUEUE_SONG } from "../../../sql";

export const queueSongAfter = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const client = await context.pg.connect();
	const query = pgHelpersQuery(client);
	const exists = pgHelpersExists(client);

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

		const nexts = await query(SELECT_QUEUE)({
			parse: getResultRowCount,
			variables: {
				userID,
				columnNames: ["*"],
				tableName: ["queue_nexts"],
			},
		});

		await query(INSERT_QUEUE_SONG)({
			variables: {
				userID,
				songID,
				index: nexts,
				tableName: ["queue_nexts"],
			},
		});

		await query("COMMIT")();
	} catch (error) {
		await query("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
