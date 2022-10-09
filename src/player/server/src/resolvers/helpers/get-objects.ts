import {
	KeyID,
	UserID,
	SongID,
	PlayID,
	GenreID,
	AlbumID,
	ArtistID,
	PlaylistID,
	PlaylistPrivacy,
} from "@oly_op/musicloud-common/build/types";

import { join, query, PoolOrClient, convertFirstRowToCamelCaseOrNull } from "@oly_op/pg-helpers";

import { isNull } from "lodash-es";

import { Key, Song, User, Play, Genre, Album, Artist, Playlist } from "../../types";

import {
	SELECT_KEY_BY_ID,
	SELECT_SONG_BY_ID,
	SELECT_USER_BY_ID,
	SELECT_PLAY_BY_ID,
	SELECT_GENRE_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql";

import { COLUMN_NAMES } from "../../globals";

export const getKey =
	(client: PoolOrClient) =>
	async ({ keyID }: KeyID) => {
		const key = await query(client)(SELECT_KEY_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Key>(),
			variables: {
				keyID,
				columnNames: join(COLUMN_NAMES.KEY),
			},
		});
		if (isNull(key)) {
			throw new Error("Key does not exist");
		} else {
			return key;
		}
	};

export const getUser =
	(client: PoolOrClient) =>
	async ({ userID }: UserID) => {
		const user = await query(client)(SELECT_USER_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<User>(),
			variables: {
				userID,
				columnNames: join(COLUMN_NAMES.USER),
			},
		});
		if (isNull(user)) {
			throw new Error("User does not exist");
		} else {
			return user;
		}
	};

export const getSong =
	(client: PoolOrClient) =>
	async ({ songID }: SongID) => {
		const song = await query(client)(SELECT_SONG_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Song>(),
			variables: {
				songID,
				columnNames: join(COLUMN_NAMES.SONG),
			},
		});
		if (isNull(song)) {
			throw new Error("Song does not exist");
		} else {
			return song;
		}
	};

export const getPlay =
	(client: PoolOrClient) =>
	async ({ playID }: PlayID) => {
		const play = await query(client)(SELECT_PLAY_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Play>(),
			variables: {
				playID,
				columnNames: join(COLUMN_NAMES.PLAY),
			},
		});
		if (isNull(play)) {
			throw new Error("Play does not exist");
		} else {
			return play;
		}
	};

export const getGenre =
	(client: PoolOrClient) =>
	async ({ genreID }: GenreID) => {
		const genre = await query(client)(SELECT_GENRE_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Genre>(),
			variables: {
				genreID,
				columnNames: join(COLUMN_NAMES.GENRE),
			},
		});
		if (isNull(genre)) {
			throw new Error("Genre does not exist");
		} else {
			return genre;
		}
	};

export const getAlbum =
	(client: PoolOrClient) =>
	async ({ albumID }: AlbumID) => {
		const album = await query(client)(SELECT_ALBUM_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Album>(),
			variables: {
				albumID,
				columnNames: join(COLUMN_NAMES.ALBUM),
			},
		});
		if (isNull(album)) {
			throw new Error("Album does not exist");
		} else {
			return album;
		}
	};

export const getArtist =
	(client: PoolOrClient) =>
	async ({ artistID }: ArtistID) => {
		const artist = await query(client)(SELECT_ARTIST_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Artist>(),
			variables: {
				artistID,
				columnNames: join(COLUMN_NAMES.ARTIST),
			},
		});
		if (isNull(artist)) {
			throw new Error("Artist does not exist");
		} else {
			return artist;
		}
	};

export const getPlaylist =
	(client: PoolOrClient) =>
	async ({ playlistID }: PlaylistID): Promise<Playlist> => {
		const playlist = await query(client)(SELECT_PLAYLIST_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Playlist>(),
			variables: {
				playlistID,
				columnNames: join(COLUMN_NAMES.PLAYLIST),
			},
		});
		if (isNull(playlist)) {
			throw new Error("Playlist does not exist");
		} else {
			return {
				...playlist,
				privacy: playlist.privacy.toUpperCase() as PlaylistPrivacy,
			};
		}
	};
