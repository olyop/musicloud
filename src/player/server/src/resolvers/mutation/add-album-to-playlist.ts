import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlbumID, PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertTableToCamelCase, exists, query } from "@oly_op/pg-helpers";
import { isEmpty, last } from "lodash-es";

import { SELECT_ALBUM_SONGS, SELECT_PLAYLIST_SONGS_RELATIONS } from "../../sql";
import { IndexOptions, Playlist, PlaylistSong } from "../../types";
import { addSongToPlaylist, getPlaylist, isNotUsersPlaylist } from "../helpers";
import { isSongInPlaylist } from "../helpers/is-song-in-playlist";
import resolver from "./resolver";

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

	const [albumSongs, playlistSongs] = await Promise.all([
		query(context.pg)(SELECT_ALBUM_SONGS)({
			parse: convertTableToCamelCase<SongID>(),
			variables: {
				albumID,
				columnNames: [COLUMN_NAMES.SONG[0]],
			},
		}),
		query(context.pg)(SELECT_PLAYLIST_SONGS_RELATIONS)({
			parse: convertTableToCamelCase<Pick<PlaylistSong, "index">>(),
			variables: {
				playlistID,
				columnNames: [COLUMN_NAMES.PLAYLIST_SONG[0]],
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
