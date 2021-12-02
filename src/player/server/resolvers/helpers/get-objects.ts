import {
	KeyID,
	UserID,
	SongID,
	PlayID,
	GenreID,
	AlbumID,
	ArtistID,
	PlaylistID,
} from "@oly_op/music-app-common/types"

import {
	join,
	query,
	PoolOrClient,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	Key,
	Song,
	User,
	Play,
	Genre,
	Album,
	Artist,
	Playlist,
} from "../../types"

import {
	SELECT_KEY_BY_ID,
	SELECT_SONG_BY_ID,
	SELECT_USER_BY_ID,
	SELECT_PLAY_BY_ID,
	SELECT_GENRE_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { COLUMN_NAMES } from "../../globals"

export const getKey =
	(client: PoolOrClient) =>
		({ keyID }: KeyID) =>
			query(client)(SELECT_KEY_BY_ID)({
				parse: convertFirstRowToCamelCase<Key>(),
				variables: {
					keyID,
					columnNames: join(COLUMN_NAMES.KEY),
				},
			})

export const getUser =
	(client: PoolOrClient) =>
		({ userID }: UserID) =>
			query(client)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})

export const getSong =
	(client: PoolOrClient) =>
		({ songID }: SongID) =>
			query(client)(SELECT_SONG_BY_ID)({
				parse: convertFirstRowToCamelCase<Song>(),
				variables: {
					songID,
					columnNames: join(COLUMN_NAMES.SONG),
				},
			})

export const getPlay =
	(client: PoolOrClient) =>
		({ playID }: PlayID) =>
			query(client)(SELECT_PLAY_BY_ID)({
				parse: convertFirstRowToCamelCase<Play>(),
				variables: {
					playID,
					columnNames: join(COLUMN_NAMES.PLAY),
				},
			})

export const getGenre =
	(client: PoolOrClient) =>
		({ genreID }: GenreID) =>
			query(client)(SELECT_GENRE_BY_ID)({
				parse: convertFirstRowToCamelCase<Genre>(),
				variables: {
					genreID,
					columnNames: join(COLUMN_NAMES.GENRE),
				},
			})

export const getAlbum =
	(client: PoolOrClient) =>
		({ albumID }: AlbumID) =>
			query(client)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})

export const getArtist =
	(client: PoolOrClient) =>
		({ artistID }: ArtistID) =>
			query(client)(SELECT_ARTIST_BY_ID)({
				parse: convertFirstRowToCamelCase<Artist>(),
				variables: {
					artistID,
					columnNames: join(COLUMN_NAMES.ARTIST),
				},
			})

export const getPlaylist =
	(client: PoolOrClient) =>
		({ playlistID }: PlaylistID) =>
			query(client)(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCase<Playlist>(),
				variables: {
					playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})