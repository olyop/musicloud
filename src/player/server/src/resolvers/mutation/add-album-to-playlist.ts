import { isEmpty, last } from "lodash-es";
import { AlbumID, PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { exists, convertTableToCamelCase, query, PoolOrClient } from "@oly_op/pg-helpers";

import resolver from "./resolver";
import { COLUMN_NAMES } from "../../globals";
import { Song, Playlist, PlaylistSong, IndexOptions } from "../../types";
import { isSongInPlaylist } from "../helpers/is-song-in-playlist";
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers";
import { SELECT_ALBUM_SONGS, SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql";

const handleAddSongToPlaylist =
	(pg: PoolOrClient) =>
	(startingIndex: number) =>
	async ({ index, songID, playlistID }: HandleAddSongToPlaylistOptions) => {
		const isInPlaylist = await isSongInPlaylist(pg)({ songID, playlistID });
		if (!isInPlaylist) {
			await addSongToPlaylist(pg)({
				songID,
				playlistID,
				index: startingIndex + index,
			});
		}
	};

interface HandleAddSongToPlaylistOptions extends SongID, PlaylistID, IndexOptions {}

interface Args extends AlbumID, PlaylistID {}

export const addAlbumToPlaylist = resolver<Playlist, Args>(async ({ context, args }) => {
	const { albumID, playlistID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const albumExists = await exists(context.pg)({
		value: albumID,
		table: "albums",
		column: COLUMN_NAMES.ALBUM[0],
	});

	if (!albumExists) {
		throw new Error("Album does not exist");
	}

	const playlistExists = await exists(context.pg)({
		value: playlistID,
		table: "playlists",
		column: COLUMN_NAMES.PLAYLIST[0],
	});

	if (!playlistExists) {
		throw new Error("Playlist does not exist");
	}

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to add to playlist");
	}

	const [albumSongs, playlistSongs] = await Promise.all([
		query(context.pg)(SELECT_ALBUM_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				albumID,
				columnNames: COLUMN_NAMES.SONG[0],
			},
		}),
		query(context.pg)(SELECT_PLAYLIST_SONGS_RELATIONS)({
			parse: convertTableToCamelCase<PlaylistSong>(),
			variables: {
				playlistID,
				columnNames: COLUMN_NAMES.PLAYLIST_SONG[0],
			},
		}),
	]);

	if (isEmpty(albumSongs)) {
		throw new Error("No songs in album");
	}

	let startingIndex: number;
	const lastPlaylistSong = last(playlistSongs);

	if (lastPlaylistSong) {
		startingIndex = lastPlaylistSong.index + 1;
	} else {
		startingIndex = 0;
	}

	await Promise.all(
		albumSongs.map(({ songID }, index) =>
			handleAddSongToPlaylist(context.pg)(startingIndex)({
				index,
				songID,
				playlistID,
			}),
		),
	);

	return getPlaylist(context.pg)({ playlistID });
});
