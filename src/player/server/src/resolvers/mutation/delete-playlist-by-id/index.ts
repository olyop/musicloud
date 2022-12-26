import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import {
	deleteCacheValue,
	determineRedisPlaylistsKey,
	isNotUsersPlaylist,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

const DELETE_PLAYLIST_BY_ID = await importSQL(import.meta.url)("delete-playlist-by-id");

export const deletePlaylistByID =
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	resolver<void, PlaylistID>(async ({ args, context }) => {
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

		if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
			throw new Error("Unauthorized to delete playlist");
		}

		await query(context.pg)(DELETE_PLAYLIST_BY_ID)({
			variables: { playlistID },
		});

		await context.ag.index.deleteObject(playlistID);

		await deleteCacheValue(context.redis)(determineRedisPlaylistsKey(playlistID, "row"));
	});
