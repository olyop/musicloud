import {
	join,
	query,
	PoolOrClient,
	getResultRowCount,
	getResultRowCountOrNull,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { head as lodashHead } from "lodash"

import {
	Song,
	Play,
	Album,
	Artist,
	OrderByArgs,
	GetObjectsOptions,
} from "../types"

import {
	createResolver,
	getObjectInLibrary,
	getObjectDateAddedToLibrary,
	determineSongsSQLOrderByField,
} from "./helpers"

import {
	SELECT_ARTIST_PLAYS,
	SELECT_ARTIST_SONGS,
	SELECT_ARTIST_ALBUMS,
	SELECT_OBJECT_SONG_PLAYS,
	SELECT_ARTIST_TOP_TEN_SONGS,
} from "../sql"

import { COLUMN_NAMES } from "../globals"

const head =
	<T>() => (array: T[]) => lodashHead<T>(array)!

const resolver =
	createResolver<Artist>()

export const playsTotal =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ARTIST_PLAYS)({
				parse: getResultRowCountOrNull,
				variables: {
					artistID: parent.artistID,
				},
			})
		),
	)

const getSongs =
	(client: PoolOrClient) =>
		<T>({ objectID, parse, orderBy }: GetObjectsOptions<T>) =>
			query(client)(SELECT_ARTIST_SONGS)({
				parse,
				variables: {
					artistID: objectID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByDirection: orderBy?.direction || "ASC",
					orderByField: determineSongsSQLOrderByField(
						orderBy?.field.toLowerCase() || "title",
					),
				},
			})

export const songs =
	resolver<Song[], OrderByArgs>(
		({ parent, args, context }) => (
			getSongs(context.pg)({
				orderBy: args.orderBy,
				objectID: parent.artistID,
				parse: convertTableToCamelCase(),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				parse: getResultRowCount,
				objectID: parent.artistID,
			})
		),
	)

const getAlbums =
	(client: PoolOrClient) =>
		<T>({ objectID, parse, orderBy }: GetObjectsOptions<T>) =>
			query(client)(SELECT_ARTIST_ALBUMS)({
				parse,
				variables: {
					artistID: objectID,
					orderByField: orderBy?.field || "title",
					orderByDirection: orderBy?.direction || "ASC",
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})

export const albums =
	resolver<Album[], OrderByArgs>(
		({ parent, args, context }) => (
			getAlbums(context.pg)({
				orderBy: args.orderBy,
				objectID: parent.artistID,
				parse: convertTableToCamelCase(),
			})
		),
	)

export const albumsTotal =
	resolver<number>(
		({ parent, context }) => (
			getAlbums(context.pg)({
				parse: getResultRowCount,
				objectID: parent.artistID,
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
						artistID: objectID,
						columnNames: join(COLUMN_NAMES.PLAY),
					},
				})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.artistID,
				parse: convertTableToCamelCase<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.artistID,
				parse: getResultRowCountOrNull,
			})
		),
	)

export const dateAddedToLibrary =
	resolver(
		({ parent, context }) => (
			getObjectDateAddedToLibrary(context.pg)({
				columnName: "artist_id",
				objectID: parent.artistID,
				libraryTableName: "library_artists",
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		({ parent, context }) => (
			getObjectInLibrary(context.pg)({
				columnName: "artist_id",
				objectID: parent.artistID,
				libraryTableName: "library_artists",
				userID: context.authorization!.userID,
			})
		),
	)

export const topTenSongs =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ARTIST_TOP_TEN_SONGS)({
				parse: convertTableToCamelCase<Song>(),
				variables: {
					artistID: parent.artistID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})
		),
	)

export const firstAlbumReleaseDate =
	resolver(
		({ parent, context }) => (
			getAlbums(context.pg)({
				objectID: parent.artistID,
				orderBy: { field: "released", direction: "ASC" },
				parse: pipe(
					convertTableToCamelCase<Album>(),
					head(),
					({ released }) => released,
				),
			})
		),
	)