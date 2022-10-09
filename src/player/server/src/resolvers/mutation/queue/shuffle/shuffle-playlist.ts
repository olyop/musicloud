import { isEmpty } from "lodash-es";
import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { join, query, convertTableToCamelCase } from "@oly_op/pg-helpers";

import resolver from "../../resolver";
import { Song } from "../../../../types";
import { COLUMN_NAMES } from "../../../../globals";
import { INSERT_QUEUE_SONG, SELECT_PLAYLIST_SONGS } from "../../../../sql";
import { shuffle, clearQueue, updateQueueNowPlaying } from "../../../helpers";

export const shufflePlaylist = resolver<Record<string, never>, PlaylistID>(
	async ({ args, context }) => {
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const songs = await query(context.pg)(SELECT_PLAYLIST_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				playlistID: args.playlistID,
				columnNames: join(COLUMN_NAMES.SONG, "songs"),
			},
		});

		if (!isEmpty(songs)) {
			const client = await context.pg.connect();

			const [nowPlaying, ...shuffled] = await shuffle(context.randomDotOrg)(songs);

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

				const updateQueueLater = shuffled.map(({ songID }, index) =>
					query(client)(INSERT_QUEUE_SONG)({
						variables: {
							index,
							userID,
							songID,
							tableName: "queue_laters",
						},
					}),
				);

				await Promise.all([updateNowPlaying, ...updateQueueLater]);

				await query(client)("COMMIT")();
			} catch (error) {
				await query(client)("ROLLBACK")();
				throw error;
			} finally {
				client.release();
			}
		}

		return {};
	},
);
