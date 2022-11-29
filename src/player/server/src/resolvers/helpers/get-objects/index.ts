import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	AlbumID,
	ArtistID,
	GenreID,
	KeyID,
	PlayID,
	PlaylistID,
	PlaylistPrivacy,
	SongID,
	UserID,
} from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCaseOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { isNull } from "lodash-es";

import { Album, Artist, Genre, Key, Play, Playlist, Song, User } from "../../../types";

const isf = importSQL(import.meta.url);

const SELECT_ALBUM_BY_ID = await isf("select-album-by-id");
const SELECT_ARTIST_BY_ID = await isf("select-artist-by-id");
const SELECT_GENRE_BY_ID = await isf("select-genre-by-id");
const SELECT_KEY_BY_ID = await isf("select-key-by-id");
const SELECT_PLAYLIST_BY_ID = await isf("select-playlist-by-id");
const SELECT_PLAY_BY_ID = await isf("select-play-by-id");
const SELECT_SONG_BY_ID = await isf("select-song-by-id");
const SELECT_USER_BY_ID = await isf("select-user-by-id");

export const getKey =
	(client: PoolOrClient) =>
	async ({ keyID }: KeyID) => {
		const key = await query(client)(SELECT_KEY_BY_ID)({
			parse: convertFirstRowToCamelCaseOrNull<Key>(),
			variables: {
				keyID,
				columnNames: addPrefix(COLUMN_NAMES.KEY, "keys"),
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
				columnNames: addPrefix(COLUMN_NAMES.USER, "users"),
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
				columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
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
				columnNames: addPrefix(COLUMN_NAMES.PLAY, "plays"),
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
				columnNames: addPrefix(COLUMN_NAMES.GENRE, "genres"),
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
				columnNames: addPrefix(COLUMN_NAMES.ALBUM, "albums"),
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
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
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
				columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
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
