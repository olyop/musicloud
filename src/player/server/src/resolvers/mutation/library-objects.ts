import {
	join,
	query,
	exists,
	convertTableToCamelCase,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	SongID,
	AlbumID,
	ArtistID,
	PlaylistID,
} from "@oly_op/musicloud-common/build/types"

import {
	SELECT_SONG_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_ALBUM_SONGS,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import {
	getPlaylist,
	handleInLibrary,
	HandleInLibraryOptions,
} from "../helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Artist, Playlist, Album } from "../../types"

type CreateConfig =
	(input: Pick<HandleInLibraryOptions, "userID" | "objectID" | "inLibrary">) => HandleInLibraryOptions

const createSongConfig: CreateConfig =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		typeName: "Song",
		tableName: "songs",
		columnKey: "songID",
		columnNames: COLUMN_NAMES.SONG,
		returnQuery: SELECT_SONG_BY_ID,
		columnName: COLUMN_NAMES.SONG[0],
		libraryTableName: "library_songs",
	})

const createArtistConfig: CreateConfig =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		typeName: "Artist",
		tableName: "artists",
		columnKey: "artistID",
		columnNames: COLUMN_NAMES.ARTIST,
		returnQuery: SELECT_ARTIST_BY_ID,
		columnName: COLUMN_NAMES.ARTIST[0],
		libraryTableName: "library_artists",
	})

const createPlaylistConfig: CreateConfig =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		typeName: "Playlist",
		tableName: "playlists",
		columnKey: "playlistID",
		columnNames: COLUMN_NAMES.PLAYLIST,
		returnQuery: SELECT_PLAYLIST_BY_ID,
		columnName: COLUMN_NAMES.PLAYLIST[0],
		libraryTableName: "library_playlists",
	})

export const addSongToLibrary =
	resolver<Song | null, SongID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createSongConfig({
					inLibrary: true,
					objectID: args.songID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		),
	)

export const removeSongFromLibrary =
	resolver<Song | null, SongID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createSongConfig({
					inLibrary: false,
					objectID: args.songID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		),
	)

export const addArtistToLibrary =
	resolver<Artist | null, ArtistID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createArtistConfig({
					inLibrary: true,
					objectID: args.artistID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		),
	)

export const removeArtistFromLibrary =
	resolver<Artist | null, ArtistID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createArtistConfig({
					inLibrary: false,
					objectID: args.artistID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		),
	)

export const addPlaylistToLibrary =
	resolver<Playlist | null, PlaylistID>(
		async ({ args, context }) => {
			const { playlistID } = args

			const playlist =
				await getPlaylist(context.pg)({ playlistID })

			if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
				throw new Error("Users own playlist is always followed")
			}

			return handleInLibrary(context.pg)(
				createPlaylistConfig({
					inLibrary: true,
					objectID: args.playlistID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		},
	)

export const removePlaylistFromLibrary =
	resolver<Playlist | null, PlaylistID>(
		async ({ args, context }) => {
			const { playlistID } = args

			const playlist =
				await getPlaylist(context.pg)({ playlistID })

			if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
				throw new Error("Users own playlist is always followed")
			}

			return handleInLibrary(context.pg)(
				createPlaylistConfig({
					inLibrary: false,
					objectID: args.playlistID,
					userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				}),
			)
		},
	)

export const addAlbumToLibrary =
	resolver<Album | null, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args

			const albumExists =
				await exists(context.pg)({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new Error("Album does not exist")
			}

			const songs =
				await query(context.pg)(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID,
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const song of songs) {
				await handleInLibrary(context.pg)(
					createSongConfig({
						inLibrary: true,
						objectID: song.songID,
						userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					}),
				)
			}

			return query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		},
	)

export const removeAlbumFromLibrary =
	resolver<Album | null, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args

			const albumExists =
				await exists(context.pg)({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new Error("Album does not exist")
			}

			const songs =
				await query(context.pg)(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID,
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const song of songs) {
				await handleInLibrary(context.pg)(
					createSongConfig({
						inLibrary: false,
						objectID: song.songID,
						userID: context.getAuthorizationJWTPayload(context.authorization).userID,
					}),
				)
			}

			return query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		},
	)