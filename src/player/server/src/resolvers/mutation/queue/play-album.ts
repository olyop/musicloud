import { isEmpty } from "lodash-es";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { join, query, convertTableToCamelCase, exists } from "@oly_op/pg-helpers";

import resolver from "../resolver";
import { Song } from "../../../types";
import { clearQueue, updateQueueNowPlaying } from "../../helpers";
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../../sql";

export const playAlbum = resolver<Record<string, never>, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const albumExists = await exists(context.pg)({
		value: albumID,
		table: "albums",
		column: COLUMN_NAMES.ALBUM[0],
	});

	if (!albumExists) {
		throw new Error("Album does not exist");
	}

	const albumSongs = await query(context.pg)(SELECT_ALBUM_SONGS)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			albumID,
			columnNames: join(COLUMN_NAMES.SONG),
		},
	});

	if (!isEmpty(albumSongs)) {
		const [nowPlaying, ...songs] = albumSongs;

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
