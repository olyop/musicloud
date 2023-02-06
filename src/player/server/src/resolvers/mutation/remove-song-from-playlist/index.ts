import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { convertFirstRowToCamelCase, importSQL, query } from "@oly_op/pg-helpers";
import { Redis } from "ioredis";
import { pipe } from "rxjs";

import { IndexOptions, Playlist, Song } from "../../../types/index.js";
import {
	deleteCacheValue,
	determineRedisPlaylistsKey,
	getCacheValue,
	getPlaylist,
	isNotUsersPlaylist,
	setCacheValue,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

const isf = importSQL(import.meta.url);

const EXEC_REMOVE_SONG_FROM_PLAYLIST = await isf("exec-remove-song-from-playlist");

const updatePlaylistSongsCache =
	(redis: Redis) =>
	async ({ playlistID }: PlaylistID, { songID }: SongID) => {
		const songsCacheKey = determineRedisPlaylistsKey(playlistID, "songs");
		const songsCacheValue = await getCacheValue(redis)<Song[]>(songsCacheKey);
		if (songsCacheValue) {
			if (songsCacheValue.length === 1) {
				await deleteCacheValue(redis)(songsCacheKey);
			} else {
				await setCacheValue(redis)(
					songsCacheKey,
					songsCacheValue.filter(playlist => playlist.songID !== songID),
				);
			}
		}
	};

export const removeSongFromPlaylist = resolver<Playlist, Args>(async ({ args, context }) => {
	const { index, playlistID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to update playlist");
	}

	const songID = await query(context.pg)(EXEC_REMOVE_SONG_FROM_PLAYLIST)({
		parse: pipe(convertFirstRowToCamelCase<SongID>(), playlistSong => playlistSong.songID),
		variables: { index, playlistID },
	});

	await updatePlaylistSongsCache(context.redis)({ playlistID }, { songID });

	return getPlaylist(context.pg)({ playlistID });
});

interface Args extends PlaylistID, IndexOptions {}
