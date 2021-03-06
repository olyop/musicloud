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
} from "@oly_op/musicloud-common"

import { UserInputError } from "apollo-server-errors"

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
	HandleInLibraryOptionsBase,
} from "../helpers"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Song, Artist, Playlist, Album } from "../../types"

type ConfigFunc =
	(input: HandleInLibraryOptionsBase) => HandleInLibraryOptions

const createSongConfig: ConfigFunc =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "songs",
		columnKey: "songID",
		columnNames: COLUMN_NAMES.SONG,
		returnQuery: SELECT_SONG_BY_ID,
		columnName: COLUMN_NAMES.SONG[0],
		libraryTableName: "library_songs",
	})

const createArtistConfig: ConfigFunc =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "artists",
		columnKey: "artistID",
		columnNames: COLUMN_NAMES.ARTIST,
		returnQuery: SELECT_ARTIST_BY_ID,
		columnName: COLUMN_NAMES.ARTIST[0],
		libraryTableName: "library_artists",
	})

const createPlaylistConfig: ConfigFunc =
	({ userID, objectID, inLibrary }) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "playlists",
		columnKey: "playlistID",
		columnNames: COLUMN_NAMES.PLAYLIST,
		returnQuery: SELECT_PLAYLIST_BY_ID,
		columnName: COLUMN_NAMES.PLAYLIST[0],
		libraryTableName: "library_playlists",
	})

export const addSongToLibrary =
	resolver<Song, SongID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createSongConfig({
					inLibrary: true,
					objectID: args.songID,
					userID: context.authorization!.userID,
				}),
			)
		),
	)

export const removeSongFromLibrary =
	resolver<Song, SongID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createSongConfig({
					inLibrary: false,
					objectID: args.songID,
					userID: context.authorization!.userID,
				}),
			)
		),
	)

export const addArtistToLibrary =
	resolver<Artist, ArtistID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createArtistConfig({
					inLibrary: true,
					objectID: args.artistID,
					userID: context.authorization!.userID,
				}),
			)
		),
	)

export const removeArtistFromLibrary =
	resolver<Artist, ArtistID>(
		({ args, context }) => (
			handleInLibrary(context.pg)(
				createArtistConfig({
					inLibrary: false,
					objectID: args.artistID,
					userID: context.authorization!.userID,
				}),
			)
		),
	)

export const addPlaylistToLibrary =
	resolver<Playlist, PlaylistID>(
		async ({ args, context }) => {
			const { playlistID } = args

			const playlist =
				await getPlaylist(context.pg)({ playlistID })

			if (context.authorization!.userID === playlist.userID) {
				throw new UserInputError("Users own playlist is always followed")
			}

			return handleInLibrary(context.pg)(
				createPlaylistConfig({
					inLibrary: true,
					objectID: args.playlistID,
					userID: context.authorization!.userID,
				}),
			)
		},
	)

export const removePlaylistFromLibrary =
	resolver<Playlist, PlaylistID>(
		async ({ args, context }) => {
			const { playlistID } = args

			const playlist =
				await getPlaylist(context.pg)({ playlistID })

			if (context.authorization!.userID === playlist.userID) {
				throw new UserInputError("Users own playlist is always followed")
			}

			return handleInLibrary(context.pg)(
				createPlaylistConfig({
					inLibrary: false,
					objectID: args.playlistID,
					userID: context.authorization!.userID,
				}),
			)
		},
	)

export const addAlbumToLibrary =
	resolver<Album, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args

			const albumExists =
				await exists(context.pg)({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist")
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
						userID: context.authorization!.userID,
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
	resolver<Album, AlbumID>(
		async ({ args, context }) => {
			const { albumID } = args

			const albumExists =
				await exists(context.pg)({
					value: albumID,
					table: "albums",
					column: COLUMN_NAMES.ALBUM[0],
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist")
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
						userID: context.authorization!.userID,
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