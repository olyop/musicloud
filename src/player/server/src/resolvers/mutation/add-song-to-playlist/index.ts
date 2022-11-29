import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { convertFirstRowToCamelCaseOrNull, exists, importSQL, query } from "@oly_op/pg-helpers";

import { Playlist, PlaylistSong } from "../../../types";
import {
	addSongToPlaylist as addSongToPlaylistHelper,
	getPlaylist,
	isNotUsersPlaylist,
} from "../../helpers";
import resolver from "../resolver";

const SELECT_PLAYLIST_SONG_LAST = await importSQL(import.meta.url)("select-playlist-song-last");

export const addSongToPlaylist = resolver<Playlist, Args>(async ({ args, context }) => {
	const { songID, playlistID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to add to playlist");
	}

	const [playlistExists, songExists] = await Promise.all([
		exists(context.pg)({
			value: playlistID,
			table: "playlists",
			column: COLUMN_NAMES.PLAYLIST[0],
		}),
		exists(context.pg)({
			value: songID,
			table: "songs",
			column: COLUMN_NAMES.SONG[0],
		}),
	]);

	if (!playlistExists) {
		throw new Error("Playlist does not exist");
	}

	if (!songExists) {
		throw new Error("Song does not exist");
	}

	const lastPlaylistSong = await query(context.pg)(SELECT_PLAYLIST_SONG_LAST)({
		parse: convertFirstRowToCamelCaseOrNull<Pick<PlaylistSong, "index">>(),
		variables: {
			playlistID,
		},
	});

	const index = lastPlaylistSong ? lastPlaylistSong.index + 1 : 0;

	await addSongToPlaylistHelper(context.pg)({
		index,
		songID,
		playlistID,
	});

	return getPlaylist(context.pg)({ playlistID });
});

interface Args extends SongID, PlaylistID {}
