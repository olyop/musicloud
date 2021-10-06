import {
	join,
	query,
	exists,
	convertTableToCamelCase,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	SongIDBase,
	AlbumIDBase,
	ArtistIDBase,
	PlaylistIDBase,
} from "@oly_op/music-app-common/types"

import { UserInputError } from "apollo-server-fastify"

import {
	SELECT_SONG_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_ALBUM_SONGS,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import {
	createResolver,
	handleInLibrary,
	HandleInLibraryOptions,
} from "../helpers"

import { COLUMN_NAMES } from "../../globals"
import { Song, Artist, Playlist, Album } from "../../types"

type AddRemoveFunc =
	(inLibrary: boolean, objectID: string, userID: string) => HandleInLibraryOptions

const songConfig: AddRemoveFunc =
	(inLibrary, objectID, userID) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "songs",
		columnKey: "songID",
		columnName: "song_id",
		columnNames: COLUMN_NAMES.SONG,
		returnQuery: SELECT_SONG_BY_ID,
		libraryTableName: "library_songs",
	})

const artistConfig: AddRemoveFunc =
	(inLibrary, objectID, userID) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "artists",
		columnKey: "artistID",
		columnName: "artist_id",
		columnNames: COLUMN_NAMES.ARTIST,
		returnQuery: SELECT_ARTIST_BY_ID,
		libraryTableName: "library_artists",
	})

const playlistConfig: AddRemoveFunc =
	(inLibrary, objectID, userID) => ({
		userID,
		objectID,
		inLibrary,
		tableName: "playlists",
		columnKey: "playlistID",
		columnName: "playlist_id",
		columnNames: COLUMN_NAMES.PLAYLIST,
		returnQuery: SELECT_PLAYLIST_BY_ID,
		libraryTableName: "library_playlists",
	})

const resolver =
	createResolver()

export const addSongToLibrary =
	resolver<Song, SongIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(songConfig(
				true,
				args.songID,
				context.authorization!.userID,
			))
		),
	)

export const removeSongFromLibrary =
	resolver<Song, SongIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(songConfig(
				false,
				args.songID,
				context.authorization!.userID,
			))
		),
	)

export const addArtistToLibrary =
	resolver<Artist, ArtistIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(artistConfig(
				true,
				args.artistID,
				context.authorization!.userID,
			))
		),
	)

export const removeArtistFromLibrary =
	resolver<Artist, ArtistIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(artistConfig(
				false,
				args.artistID,
				context.authorization!.userID,
			))
		),
	)

export const addPlaylistToLibrary =
	resolver<Playlist, PlaylistIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(playlistConfig(
				true,
				args.playlistID,
				context.authorization!.userID,
			))
		),
	)

export const removePlaylistFromLibrary =
	resolver<Playlist, PlaylistIDBase>(
		({ args, context }) => (
			handleInLibrary(context.pg)(playlistConfig(
				false,
				args.playlistID,
				context.authorization!.userID,
			))
		),
	)

export const addAlbumToLibrary =
	resolver<Album, AlbumIDBase>(
		async ({ args, context }) => {
			const albumExists =
				await exists(context.pg)({
					table: "albums",
					column: "album_id",
					value: args.albumID,
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist.")
			}

			const songs =
				await query(context.pg)(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID: args.albumID,
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const song of songs) {
				await handleInLibrary(context.pg)(songConfig(
					true,
					song.songID,
					context.authorization!.userID,
				))
			}

			return query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID: args.albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		},
	)

export const removeAlbumFromLibrary =
	resolver<Album, AlbumIDBase>(
		async ({ args, context }) => {
			const albumExists =
				await exists(context.pg)({
					table: "albums",
					column: "album_id",
					value: args.albumID,
				})

			if (!albumExists) {
				throw new UserInputError("Album does not exist.")
			}

			const songs =
				await query(context.pg)(SELECT_ALBUM_SONGS)({
					parse: convertTableToCamelCase<Song>(),
					variables: {
						albumID: args.albumID,
						columnNames: join(COLUMN_NAMES.SONG),
					},
				})

			for (const song of songs) {
				await handleInLibrary(context.pg)(songConfig(
					false,
					song.songID,
					context.authorization!.userID,
				))
			}

			return query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCase<Album>(),
				variables: {
					albumID: args.albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		},
	)