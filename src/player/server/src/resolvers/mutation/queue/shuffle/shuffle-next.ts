import { query } from "@oly_op/pg-helpers";

import {
	shuffle,
	getQueueSongs,
	clearQueueNext,
	clearQueueLater,
	queuePromiseLimitter,
} from "../../../helpers";

import resolver from "../../resolver";
import { Song } from "../../../../types";
import { INSERT_QUEUE_SONG } from "../../../../sql";

export const shuffleNext = resolver(async ({ context }) => {
	const { randomDotOrg } = context;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const [nextSongs, laterSongs] = await Promise.all([
		getQueueSongs(context.pg)({ userID, tableName: "queue_nexts" }),
		getQueueSongs(context.pg)({ userID, tableName: "queue_laters" }),
	]);

	const [nextSongsShuffled, laterSongsShuffled] = await Promise.all([
		shuffle(randomDotOrg)<Song>(nextSongs),
		shuffle(randomDotOrg)<Song>(laterSongs),
	]);

	const client = await context.pg.connect();

	try {
		await query(client)("BEGIN")();

		await Promise.all([clearQueueNext(client)({ userID }), clearQueueLater(client)({ userID })]);

		await Promise.all([
			...nextSongsShuffled.map(({ songID }, index) =>
				queuePromiseLimitter(() =>
					query(client)(INSERT_QUEUE_SONG)({
						variables: {
							index,
							userID,
							songID,
							tableName: "queue_nexts",
						},
					}),
				),
			),
			...laterSongsShuffled.map(({ songID }, index) =>
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
			),
		]);

		await query(client)("COMMIT")();
	} catch (error) {
		await query(client)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
