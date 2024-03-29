import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { exists, importSQL, query } from "@oly_op/pg-helpers";

import { Playlist, Song } from "../../../types/index.js";
import {
	determineRedisPlaylistsKey,
	getCacheValue,
	getPlaylist,
	getSong,
	isNotUsersPlaylist,
	setCacheValue,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

const EXECUTE_ADD_SONG_TO_PLAYLIST = await importSQL(import.meta.url)(
	"execute-add-song-to-playlist",
);

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

	await query(context.pg)(EXECUTE_ADD_SONG_TO_PLAYLIST)({
		variables: {
			songID,
			playlistID,
		},
	});

	const songsCacheKey = determineRedisPlaylistsKey(playlistID, "songs");
	const songsCacheValue = await getCacheValue(context.redis)<Song[]>(songsCacheKey);
	if (songsCacheValue) {
		await setCacheValue(context.redis)(songsCacheKey, [
			...songsCacheValue,
			await getSong(context.pg)({ songID }),
		]);
	}

	return getPlaylist(context.pg)({ playlistID });
});

interface Args extends SongID, PlaylistID {}
