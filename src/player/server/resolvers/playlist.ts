import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { sum, isEmpty } from "lodash"

import {
	createResolver,
	getObjectInLibrary,
	getObjectDateAddedToLibrary,
} from "./helpers"

import {
	SELECT_USER_BY_ID,
	SELECT_PLAYLIST_SONGS,
	SELECT_OBJECT_SONG_PLAYS,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import { User, Song, Play, Playlist, GetObjectsOptions } from "../types"

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
			query(context.pg)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					userID: parent.userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})
		),
		false,
	)

const getSongs =
	(client: PoolOrClient) =>
		<T>({ objectID, parse }: GetObjectsOptions<T>) =>
			query(client)(SELECT_PLAYLIST_SONGS)({
				parse,
				variables: {
					playlistID: objectID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})

export const songs =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.playlistID,
				parse: convertTableToCamelCase<Song>(),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.playlistID,
				parse: getResultRowCountOrNull,
			})
		),
	)

export const duration =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.playlistID,
				parse: pipe(
					convertTableToCamelCase<Song>(),
					result => (isEmpty(result) ?
						null :
						sum(result.map(song => song.duration))
					),
				),
			})
		),
	)

const getUserPlays =
	(client: PoolOrClient) =>
		(userID: string) =>
			<T>({ objectID, parse }: GetObjectsOptions<T>) =>
				query(client)(SELECT_OBJECT_SONG_PLAYS)({
					parse,
					variables: {
						userID,
						playlistID: objectID,
						columnNames: join(COLUMN_NAMES.PLAY),
					},
				})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.userID,
				parse: convertTableToCamelCase<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.userID,
				parse: getResultRowCountOrNull,
			})
		),
	)

export const dateAddedToLibrary =
	resolver(
		({ parent, context }) => (
			getObjectDateAddedToLibrary(context.pg)({
				columnName: "playlist_id",
				objectID: parent.playlistID,
				libraryTableName: "library_playlists",
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		({ parent, context }) => (
			getObjectInLibrary(context.pg)({
				columnName: "playlist_id",
				objectID: parent.playlistID,
				libraryTableName: "library_playlists",
				userID: context.authorization!.userID,
			})
		),
	)