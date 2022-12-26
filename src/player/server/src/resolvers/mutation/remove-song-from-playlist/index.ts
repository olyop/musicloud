import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { importSQL, query } from "@oly_op/pg-helpers";

import { IndexOptions, Playlist } from "../../../types/index.js";
import { getPlaylist, isNotUsersPlaylist } from "../../helpers/index.js";
import resolver from "../resolver.js";

const DELETE_PLAYLIST_SONG = await importSQL(import.meta.url)("delete-playlist-song");

export const removeSongFromPlaylist = resolver<Playlist, Args>(async ({ args, context }) => {
	const { index, playlistID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to update playlist");
	}

	await query(context.pg)(DELETE_PLAYLIST_SONG)({
		variables: { index, playlistID },
	});

	return getPlaylist(context.pg)({ playlistID });
});

interface Args extends PlaylistID, IndexOptions {}
