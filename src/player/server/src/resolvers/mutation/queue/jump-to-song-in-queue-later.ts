import {
	query,
	getResultExists,
} from "@oly_op/pg-helpers";

import { find, isEmpty } from "lodash-es";

import {
	DELETE_QUEUE_SONG,
	EXISTS_QUEUE_SONG,
	UPDATE_QUEUE_SONG_INDEX,
} from "../../../sql";

import resolver from "../resolver";
import { IndexOptions } from "../../../types";
import { updateQueueNowPlaying, getQueueSection } from "../../helpers";

export const jumpToSongInQueueLater = resolver<Record<string, never>, IndexOptions>(
	async ({ args, context }) => {
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const pg = await context.pg.connect();

		const queueSongExists = await query(context.pg)(EXISTS_QUEUE_SONG)({
			parse: getResultExists,
			variables: {
				userID,
				index: args.index,
				tableName: ["queue_laters"],
			},
		});

		if (!queueSongExists) {
			throw new Error("Queue song does not exist");
		}

		try {
			await query(context.pg)("BEGIN")();

			const nextSongs = await getQueueSection(context.pg)({
				userID,
				tableName: "queue_nexts",
			});

			const laterSongs = await getQueueSection(context.pg)({
				userID,
				tableName: "queue_laters",
			});

			if (laterSongs && isEmpty(nextSongs) && !isEmpty(laterSongs)) {
				await updateQueueNowPlaying(
					pg,
					context.ag.index,
				)({
					userID,
					value: find(laterSongs, { index: args.index })!.songID,
				});

				await Promise.all(
					laterSongs.slice(0, args.index).map(queueSong =>
						query(context.pg)(DELETE_QUEUE_SONG)({
							variables: {
								userID,
								index: queueSong.index,
								tableName: ["queue_laters"],
							},
						}),
					),
				);

				await query(context.pg)(DELETE_QUEUE_SONG)({
					variables: {
						userID,
						index: args.index,
						tableName: ["queue_laters"],
					},
				});

				await Promise.all(
					laterSongs.slice(args.index + 1).map(({ index }, newIndex) =>
						query(context.pg)(UPDATE_QUEUE_SONG_INDEX)({
							variables: {
								index,
								userID,
								newIndex,
								tableName: ["queue_laters"],
							},
						}),
					),
				);
			}

			await query(context.pg)("COMMIT")();
		} catch (error) {
			await query(context.pg)("ROLLBACK")();
			throw error;
		} finally {
			pg.release();
		}

		return {};
	},
);
