import { isEmpty } from "lodash-es";
import { ArtistID } from "@oly_op/musicloud-common/build/types";
import { join, query, convertTableToCamelCase, exists } from "@oly_op/pg-helpers";

import resolver from "../../resolver";
import { Song } from "../../../../types";
import { COLUMN_NAMES } from "../../../../globals";
import { INSERT_QUEUE_SONG, SELECT_ARTIST_SONGS } from "../../../../sql";
import { shuffle, clearQueue, updateQueueNowPlaying } from "../../../helpers";

export const shuffleArtist = resolver<Record<string, never>, ArtistID>(
	async ({ args, context }) => {
		const { artistID } = args;
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const artistExists = await exists(context.pg)({
			value: artistID,
			table: "artists",
			column: COLUMN_NAMES.ARTIST[0],
		});

		if (!artistExists) {
			throw new Error("Artist does not exist");
		}

		const artistSongs = await query(context.pg)(SELECT_ARTIST_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				artistID,
				columnNames: join(COLUMN_NAMES.SONG, "songs"),
			},
		});

		if (isEmpty(artistSongs)) {
			throw new Error("Artist has no songs");
		}

		const [nowPlaying, ...shuffled] = await shuffle(context.randomDotOrg)(artistSongs);

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

			const updateQueueLaters = shuffled.map(({ songID }, index) =>
				query(client)(INSERT_QUEUE_SONG)({
					variables: {
						index,
						songID,
						userID,
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

		return {};
	},
);
