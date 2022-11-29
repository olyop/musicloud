import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import { addPrefix, bulkInsert, convertTableToCamelCaseOrNull, query } from "@oly_op/pg-helpers";
import { isEmpty, isNull } from "lodash-es";

import { SELECT_ALBUM_SONGS } from "../../../../sql";
import { QueueSong, Song } from "../../../../types";
import { clearQueue, shuffle, updateQueueNowPlaying } from "../../../helpers";
import resolver from "../../resolver";

export const shuffleAlbum = resolver<Record<string, never>, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const albumsSongs = await query(context.pg)(SELECT_ALBUM_SONGS)({
		parse: convertTableToCamelCaseOrNull<Song>(),
		variables: {
			albumID,
			columnNames: addPrefix(COLUMN_NAMES.SONG),
		},
	});

	if (isNull(albumsSongs)) {
		throw new Error("Album does not exist");
	}

	if (isEmpty(albumsSongs)) {
		throw new Error("Album has no songs");
	}

	const [nowPlaying, ...shuffled] = await shuffle(context.randomDotOrg)(albumsSongs);

	const client = await context.pg.connect();

	try {
		await query(client)("BEGIN")();

		await clearQueue(client)({ userID });

		await updateQueueNowPlaying(
			client,
			context.ag.index,
		)({
			userID,
			value: nowPlaying!.songID,
		});

		const queueSongs = shuffled.map<QueueSong>(({ songID }, index) => ({
			userID,
			songID,
			index,
		}));

		await bulkInsert(client)({
			data: queueSongs,
			table: "queue_laters",
			columns: [
				{
					key: "index",
					itemToValue: x => x.index,
				},
				{
					key: "songID",
					itemToValue: x => x.songID,
				},
				{
					key: "userID",
					itemToValue: x => x.userID,
				},
			],
		});

		await query(client)("COMMIT")();
	} catch (error) {
		await query(client)("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
