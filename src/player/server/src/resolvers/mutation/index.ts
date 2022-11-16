import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { bulkInsert, convertFirstRowToCamelCase, join, query } from "@oly_op/pg-helpers/build";

import { SELECT_SONG_BY_ID } from "../../sql";
import { Play, Song } from "../../types";
import resolver from "./resolver";

export const test = resolver(
	async ({ context }) => {
		const song = await query(context.pg)(SELECT_SONG_BY_ID)({
			parse: convertFirstRowToCamelCase<Song>(),
			variables: {
				songID: "ca50edfc-74f2-4241-a62b-939006079e9b",
				columnNames: join(COLUMN_NAMES.SONG),
			},
		});

		const plays: Omit<Play, "playID" | "dateCreated">[] = [];

		let index = 0;
		while (index < 10_100) {
			plays.push({
				songID: song.songID,
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
			});
			index += 1;
		}

		await bulkInsert(context.pg)({
			data: plays,
			table: "plays",
			columns: [
				{
					key: "songID",
					itemToValue: ({ songID }) => songID,
				},
				{
					key: "userID",
					itemToValue: ({ userID }) => userID,
				},
			],
		});
	},
	{ global: false },
);

export * from "./queue";
export * from "./follow-user";
export * from "./delete-user";
export * from "./un-follow-user";
export * from "./delete-library";
export * from "./create-playlist";
export * from "./library-objects";
export * from "./change-password";
export * from "./add-song-to-playlist";
export * from "./add-album-to-playlist";
export * from "./delete-playlist-by-id";
export * from "./update-playlist-title";
export * from "./add-catalog-to-library";
export * from "./update-playlist-privacy";
export * from "./remove-song-from-playlist";
