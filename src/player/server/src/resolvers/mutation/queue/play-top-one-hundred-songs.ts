import { isEmpty } from "lodash-es";
import { query } from "@oly_op/pg-helpers";

import { clearQueue, getTopSongs, updateQueueNowPlaying } from "../../helpers";

import resolver from "../resolver";
import { INSERT_QUEUE_SONG } from "../../../sql";

export const playTopOneHundredSongs = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const topOneHundredSongs = await getTopSongs(context.pg)(100);

	if (!isEmpty(topOneHundredSongs)) {
		const [nowPlaying, ...songs] = topOneHundredSongs;

		const client = await context.pg.connect();

		try {
			await query(client)("BEGIN")();

			await clearQueue(client)({ userID });

			const updateNowPlaying = updateQueueNowPlaying(
				client,
				context.ag.index,
			)({
				userID,
				value: nowPlaying!.songID,
			});

			const updateQueueLaters = songs.map(({ songID }, index) =>
				query(client)(INSERT_QUEUE_SONG)({
					variables: {
						index,
						userID,
						songID,
						tableName: "queue_laters",
					},
				}),
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
