import {
	KeyIDBase,
	UserIDBase,
	SongIDBase,
	PlayIDBase,
	GenreIDBase,
	AlbumIDBase,
	ArtistIDBase,
	PlaylistIDBase,
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
		({ keyID }: KeyIDBase) =>
			query(client)(SELECT_KEY_BY_ID)({
				parse: convertFirstRowToCamelCase<Key>(),
				variables: {
					keyID,
					columnNames: join(COLUMN_NAMES.KEY),
				},
			})

export const getUser =
	(client: PoolOrClient) =>
		({ userID }: UserIDBase) =>
			query(client)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})

export const getSong =
	(client: PoolOrClient) =>
		({ songID }: SongIDBase) =>
			query(client)(SELECT_SONG_BY_ID)({
				parse: convertFirstRowToCamelCase<Song>(),
				variables: {
					songID,
					columnNames: join(COLUMN_NAMES.SONG),
				},
			})

export const getPlay =
	(client: PoolOrClient) =>
		({ playID }: PlayIDBase) =>
			query(client)(SELECT_PLAY_BY_ID)({
				parse: convertFirstRowToCamelCase<Play>(),
				variables: {
					playID,
					columnNames: join(COLUMN_NAMES.PLAY),
				},
			})

export const getGenre =
	(client: PoolOrClient) =>
		({ genreID }: GenreIDBase) =>
			query(client)(SELECT_GENRE_BY_ID)({
				parse: convertFirstRowToCamelCase<Genre>(),
				variables: {
					genreID,
					columnNames: join(COLUMN_NAMES.GENRE),
				},
			})

export const getAlbum =
	(client: PoolOrClient) =>
		({ albumID }: AlbumIDBase) =>
			query(client)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})

export const getArtist =
	(client: PoolOrClient) =>
		({ artistID }: ArtistIDBase) =>
			query(client)(SELECT_ARTIST_BY_ID)({
				parse: convertFirstRowToCamelCase<Artist>(),
				variables: {
					artistID,
					columnNames: join(COLUMN_NAMES.ARTIST),
				},
			})

export const getPlaylist =
	(client: PoolOrClient) =>
		({ playlistID }: PlaylistIDBase) =>
			query(client)(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCase<Playlist>(),
				variables: {
					playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})