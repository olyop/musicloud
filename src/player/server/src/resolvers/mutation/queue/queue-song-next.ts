import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertTableToCamelCase,
	exists as pgHelpersExists,
	query as pgHelpersQuery,
} from "@oly_op/pg-helpers";
import isEmpty from "lodash-es/isEmpty";

import { INSERT_QUEUE_SONG, SELECT_QUEUE, UPDATE_QUEUE_SONG_CREMENT_INDEX } from "../../../sql";
import { QueueSong } from "../../../types";
import resolver from "../resolver";

export const queueSongNext = resolver<Record<string, never>, SongID>(async ({ args, context }) => {
	const { songID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const client = await context.pg.connect();
	const query = pgHelpersQuery(client);
	const exists = pgHelpersExists(client);

	const songExists = await exists({
		value: songID,
		table: "songs",
		column: COLUMN_NAMES.SONG[0],
	});

	if (!songExists) {
		throw new Error("Song does not exist");
	}

	try {
		await query("BEGIN")();

		const nexts = await query(SELECT_QUEUE)({
			parse: convertTableToCamelCase<QueueSong>(),
			variables: {
				userID,
				tableName: ["queue_nexts"],
				columnNames: addPrefix(COLUMN_NAMES.QUEUE_SONG),
			},
		});

		if (!isEmpty(nexts)) {
			for (const next of nexts) {
				await query(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
					variables: {
						userID,
						crement: ["+"],
						index: next.index,
						tableName: ["queue_nexts"],
					},
				});
			}
		}

		await query(INSERT_QUEUE_SONG)({
			variables: {
				userID,
				songID,
				index: 0,
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
