import { query } from "@oly_op/pg-helpers";
import { find, isEmpty } from "lodash-es";

import { IndexOptions } from "../../../types/index.js";
import {
	deleteQueueSong,
	existsQueueSong,
	getQueueSection,
	updateQueueNowPlaying,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

export const jumpToSongInQueueLater = resolver<Record<string, never>, IndexOptions>(
	async ({ args, context }) => {
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const client = await context.pg.connect();

		const queueSongExists = await existsQueueSong(client)({
			userID,
			index: args.index,
			tableName: "queue_laters",
		});

		if (!queueSongExists) {
			throw new Error("Queue song does not exist");
		}

		try {
			await query(client)("BEGIN")();

			const nextSongs = await getQueueSection(client)({
				userID,
				tableName: "queue_nexts",
			});

			const laterSongs = await getQueueSection(client)({
				userID,
				tableName: "queue_laters",
			});

			if (laterSongs && isEmpty(nextSongs) && !isEmpty(laterSongs)) {
				await updateQueueNowPlaying(
					context.pg,
					context.ag.index,
				)({
					userID,
					value: find(laterSongs, { index: args.index })!.songID,
				});

				await Promise.all(
					laterSongs.slice(0, args.index).map(queueSong =>
						deleteQueueSong(client)({
							userID,
							index: queueSong.index,
							tableName: "queue_laters",
						}),
					),
				);

				await deleteQueueSong(client)({
					userID,
					index: args.index,
					tableName: "queue_laters",
				});

				await Promise.all(
					laterSongs.slice(args.index + 1).map(({ index }, newIndex) =>
						query(client)("")({
							variables: {
								index,
								userID,
								newIndex,
								tableName: "queue_laters",
							},
						}),
					),
				);
			}

			await query(client)("COMMIT")();
		} catch (error) {
			await query(client)("ROLLBACK")();
			throw error;
		} finally {
			client.release();
		}

		return {};
	},
);
