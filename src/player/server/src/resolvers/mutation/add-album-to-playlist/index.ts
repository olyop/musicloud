import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlbumID, PlaylistID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import { Playlist } from "../../../types/index.js";
import { getPlaylist, isNotUsersPlaylist } from "../../helpers/index.js";
import resolver from "../resolver.js";

const EXECUTE_ALBUM_SONG_TO_PLAYLIST = await importSQL(import.meta.url)(
	"execute-add-album-to-playlist",
);

export const addAlbumToPlaylist = resolver<Playlist, Args>(async ({ context, args }) => {
	const { albumID, playlistID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const [albumExists, playlistExists] = await Promise.all([
		exists(context.pg)({
			value: albumID,
			table: "albums",
			column: COLUMN_NAMES.ALBUM[0],
		}),
		exists(context.pg)({
			value: playlistID,
			table: "playlists",
			column: COLUMN_NAMES.PLAYLIST[0],
		}),
	]);

	if (!albumExists) {
		throw new Error("Album does not exist");
	}

	if (!playlistExists) {
		throw new Error("Playlist does not exist");
	}

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to add to playlist");
	}

	await query(context.pg)(EXECUTE_ALBUM_SONG_TO_PLAYLIST)({
		variables: {
			albumID,
			playlistID,
		},
	});

	return getPlaylist(context.pg)({ playlistID });
});
interface Args extends AlbumID, PlaylistID {}
