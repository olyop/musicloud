import isEmpty from "lodash-es/isEmpty";
import { convertTableToCamelCase, join, query } from "@oly_op/pg-helpers";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";

import resolver from "../../resolver";
import { Song } from "../../../../types";
import { INSERT_QUEUE_SONG, SELECT_LIBRARY_SONGS } from "../../../../sql";
import { shuffle, clearQueue, updateQueueNowPlaying, queuePromiseLimitter } from "../../../helpers";

export const shuffleLibrary = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	console.log("Getting songs");
	const librarySongs = await query(context.pg)(SELECT_LIBRARY_SONGS)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			userID,
			columnNames: join(COLUMN_NAMES.SONG, "songs"),
		},
	});

	if (!isEmpty(librarySongs)) {
		const librarySongsShuffled = await shuffle(context.randomDotOrg)(librarySongs);

		const [nowPlaying, ...shuffled] = librarySongsShuffled;

		const client = await context.pg.connect();

		try {
			await query(client)("BEGIN")();

			console.log("Clearing songs");
			await clearQueue(client)({ userID });

			const updateNowPlaying = updateQueueNowPlaying(
				client,
				context.ag.index,
			)({
				userID,
				value: nowPlaying!.songID,
			});

			const updateQueueLaters = shuffled.map(({ songID }, index) =>
				queuePromiseLimitter(() =>
					query(client)(INSERT_QUEUE_SONG)({
						variables: {
							index,
							userID,
							songID,
							tableName: "queue_laters",
						},
					}),
				),
			);

			await Promise.all([updateNowPlaying, ...updateQueueLaters]);

			await query(client)("COMMIT")();
		} catch (error) {
			await query(client)("ROLLBACK")();
			throw error;
		} finally {
			client.release();
		}
	}

	return {};
});
