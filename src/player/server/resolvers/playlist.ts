import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { PlaylistIDBase, UserIDBase } from "@oly_op/music-app-common/types"

import {
	getUser,
	createResolver,
	getObjectInLibrary,
	getSongsDurationOrNull,
	getObjectDateAddedToLibrary,
} from "./helpers"

import { COLUMN_NAMES } from "../globals"
import { Song, Play, Playlist, GetObjectsOptions } from "../types"
import { SELECT_PLAYLIST_SONGS, SELECT_OBJECT_SONG_PLAYS } from "../sql"

const resolver =
	createResolver<Playlist>()

export const dateCreated =
	resolver(
		({ parent }) => (
			Promise.resolve(parent.dateCreated * 1000)
		),
	)

export const user =
	resolver(
		({ parent, context }) => (
			getUser(context.pg)({ userID: parent.userID })
		),
	)

interface GetPlaylistSongsOptions<T>
	extends PlaylistIDBase, GetObjectsOptions<T> {}

const getPlaylistSongs =
	(client: PoolOrClient) =>
		<T>({ playlistID, columnNames, parse }: GetPlaylistSongsOptions<T>) =>
			query(client)(SELECT_PLAYLIST_SONGS)({
				parse,
				variables: {
					playlistID,
					columnNames,
				},
			})

export const songs =
	resolver(
		({ parent, context }) => (
			getPlaylistSongs(context.pg)({
				playlistID: parent.playlistID,
				parse: convertTableToCamelCaseOrNull<Song>(),
				columnNames: join(COLUMN_NAMES.SONG, "songs"),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getPlaylistSongs(context.pg)({
				playlistID: parent.playlistID,
				parse: getResultRowCountOrNull,
				columnNames: `songs.${COLUMN_NAMES.SONG[0]}`,
			})
		),
	)

export const duration =
	resolver(
		({ parent, context }) => (
			getPlaylistSongs(context.pg)({
				playlistID: parent.playlistID,
				columnNames: "songs.duration",
				parse: pipe(
					convertTableToCamelCase<Song>(),
					getSongsDurationOrNull,
				),
			})
		),
	)

interface GetUserPlaylistPlaysOptions<T>
	extends UserIDBase, PlaylistIDBase, GetObjectsOptions<T> {}

const getUserPlaylistPlays =
	(client: PoolOrClient) =>
		<T>({ userID, playlistID, columnNames, parse }: GetUserPlaylistPlaysOptions<T>) =>
			query(client)(SELECT_OBJECT_SONG_PLAYS)({
				parse,
				variables: {
					userID,
					playlistID,
					columnNames,
				},
			})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlaylistPlays(context.pg)({
				playlistID: parent.playlistID,
				columnNames: join(COLUMN_NAMES.PLAY),
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlaylistPlays(context.pg)({
				playlistID: parent.playlistID,
				parse: getResultRowCountOrNull,
				columnNames: COLUMN_NAMES.PLAY[0],
				userID: context.authorization!.userID,
			})
		),
	)

export const dateAddedToLibrary =
	resolver(
		({ parent, context }) => (
			getObjectDateAddedToLibrary(context.pg)({
				objectID: parent.playlistID,
				tableName: "library_playlists",
				columnName: COLUMN_NAMES.PLAYLIST[0],
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		({ parent, context }) => (
			getObjectInLibrary(context.pg)({
				objectID: parent.playlistID,
				tableName: "library_playlists",
				columnName: COLUMN_NAMES.PLAYLIST[0],
				userID: context.authorization!.userID,
			})
		),
	)