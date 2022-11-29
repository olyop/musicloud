import { AlbumID, ArtistID, PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertTableToCamelCaseOrNull, importSQL, query } from "@oly_op/pg-helpers";
import { isNull } from "lodash-es";

import { Album, Artist, Playlist, Song } from "../../../types";
import {
	addArtistToLibraryHelper,
	addPlaylistToLibraryHelper,
	addSongToLibraryHelper,
	getAlbum,
	getPlaylist,
	removeArtistFromLibraryHelper,
	removePlaylistFromLibraryHelper,
	removeSongFromLibraryHelper,
} from "../../helpers";
import resolver from "../resolver";

const SELECT_ALBUM_SONGS = await importSQL(import.meta.url)("select-album-songs");

export const addSongToLibrary = resolver<Song, SongID>(({ args, context }) =>
	addSongToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ songID: args.songID }),
);

export const removeSongFromLibrary = resolver<Song, SongID>(({ args, context }) =>
	removeSongFromLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ songID: args.songID }),
);

export const addArtistToLibrary = resolver<Artist, ArtistID>(({ args, context }) =>
	addArtistToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ artistID: args.artistID }),
);

export const removeArtistFromLibrary = resolver<Artist, ArtistID>(({ args, context }) =>
	removeArtistFromLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ artistID: args.artistID }),
);

export const addPlaylistToLibrary = resolver<Playlist, PlaylistID>(async ({ args, context }) => {
	const { playlistID } = args;

	const playlist = await getPlaylist(context.pg)({ playlistID });

	if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
		throw new Error("Users own playlist is always followed");
	}

	return addPlaylistToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ playlistID });
});

export const removePlaylistFromLibrary = resolver<Playlist, PlaylistID>(
	async ({ args, context }) => {
		const { playlistID } = args;

		const playlist = await getPlaylist(context.pg)({ playlistID });

		if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
			throw new Error("Users own playlist is always followed");
		}

		return removePlaylistFromLibraryHelper(context.pg)({
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		})({ playlistID });
	},
);

const getAlbumSongs =
	(pg: PoolOrClient) =>
	({ albumID }: AlbumID) =>
		query(pg)(SELECT_ALBUM_SONGS)({
			parse: convertTableToCamelCaseOrNull<SongID>(),
			variables: {
				albumID,
			},
		});

export const addAlbumToLibrary = resolver<Album, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const songs = await getAlbumSongs(context.pg)({
		albumID,
	});

	if (isNull(songs)) {
		throw new Error("Album does not exist");
	} else {
		const localHelper = addSongToLibraryHelper(context.pg)({ userID });
		await Promise.resolve(songs.map(({ songID }) => localHelper({ songID })));
		return getAlbum(context.pg)({ albumID });
	}
});

export const removeAlbumFromLibrary = resolver<Album, AlbumID>(async ({ args, context }) => {
	const { albumID } = args;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const songs = await getAlbumSongs(context.pg)({
		albumID,
	});

	if (isNull(songs)) {
		throw new Error("Album does not exist");
	} else {
		const localHelper = removeSongFromLibraryHelper(context.pg)({ userID });
		await Promise.resolve(songs.map(({ songID }) => localHelper({ songID })));
		return getAlbum(context.pg)({ albumID });
	}
});
