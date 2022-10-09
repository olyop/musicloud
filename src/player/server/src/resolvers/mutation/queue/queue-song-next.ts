import {
	join,
	convertTableToCamelCase,
	query as pgHelpersQuery,
	exists as pgHelpersExists,
} from "@oly_op/pg-helpers";

import isEmpty from "lodash-es/isEmpty";
import { SongID } from "@oly_op/musicloud-common/build/types";

import { SELECT_QUEUE, INSERT_QUEUE_SONG, UPDATE_QUEUE_SONG_CREMENT_INDEX } from "../../../sql";

import resolver from "../resolver";
import { QueueSong } from "../../../types";
import { COLUMN_NAMES } from "../../../globals";

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
				tableName: "queue_nexts",
				columnNames: join(COLUMN_NAMES.QUEUE_SONG),
			},
		});

		if (!isEmpty(nexts)) {
			for (const next of nexts) {
				await query(UPDATE_QUEUE_SONG_CREMENT_INDEX)({
					variables: {
						userID,
						crement: "+",
						index: next.index,
						tableName: "queue_nexts",
					},
				});
			}
		}

		await query(INSERT_QUEUE_SONG)({
			variables: {
				userID,
				index: 0,
				songID: args.songID,
				tableName: "queue_nexts",
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
