import { isEmpty } from "lodash-es";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { join, query, exists, convertTableToCamelCase } from "@oly_op/pg-helpers";

import resolver from "../../resolver";
import { Song } from "../../../../types";
import { COLUMN_NAMES } from "../../../../globals";
import { INSERT_QUEUE_SONG, SELECT_ALBUM_SONGS } from "../../../../sql";
import { shuffle, clearQueue, updateQueueNowPlaying } from "../../../helpers";

export const shuffleAlbum = resolver<Record<string, never>, AlbumID>(async ({ args, context }) => {
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

	const albumsSongs = await query(context.pg)(SELECT_ALBUM_SONGS)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			albumID,
			columnNames: join(COLUMN_NAMES.SONG),
		},
	});

	if (isEmpty(albumsSongs)) {
		throw new Error("Album has no songs");
	}

	const [nowPlaying, ...shuffled] = await shuffle(context.randomDotOrg)(albumsSongs);

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

		const updateLaterQueue = shuffled.map(({ songID }, index) =>
			query(client)(INSERT_QUEUE_SONG)({
				variables: {
					index,
					userID,
					songID,
					tableName: "queue_laters",
				},
			}),
		);

		await Promise.all([updateNowPlaying, ...updateLaterQueue]);

		await query(client)("COMMIT")();
	} catch (error) {
		await query(client)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
