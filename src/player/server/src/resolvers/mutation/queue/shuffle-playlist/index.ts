import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver";

const EXECUTE_SHUFFLE_PLAYLIST = await importSQL(import.meta.url)("execute-shuffle-playlist");

export const shufflePlaylist = resolver<Record<string, never>, PlaylistID>(
	async ({ args, context }) => {
		const { playlistID } = args;
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const playlistExists = await exists(context.pg)({
			value: playlistID,
			table: "playlists",
			column: COLUMN_NAMES.PLAYLIST[0],
		});

		if (!playlistExists) {
			throw new Error("Playlist does not exist");
		}

		await query(context.pg)(EXECUTE_SHUFFLE_PLAYLIST)({
			variables: {
				userID,
				playlistID,
			},
		});

		return {};
	},
);
