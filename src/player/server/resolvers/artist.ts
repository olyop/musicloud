import {
	join,
	query,
	PoolOrClient,
	getResultRowCount,
	getResultRowCountOrNull,
	convertTableToCamelCase,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { pipe } from "rxjs"
import { ArtistID, UserID } from "@oly_op/music-app-common/types"

import {
	Song,
	Play,
	Album,
	Artist,
	OrderByArgs,
	GetObjectsOptions,
} from "../types"

import {
	head,
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
	SELECT_ARTIST_SONGS_ORDER_BY,
	SELECT_ARTIST_ALBUMS_ORDER_BY,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import createParentResolver from "./create-parent-resolver"

const resolver =
	createParentResolver<Artist>()

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

export const songs =
	resolver<Song[], OrderByArgs>(
		({ parent, args, context }) => (
			query(context.pg)(SELECT_ARTIST_SONGS_ORDER_BY)({
				parse: convertTableToCamelCase(),
				variables: {
					artistID: parent.artistID,
					orderByDirection: args.orderBy.direction,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByField: determineSongsSQLOrderByField(args.orderBy.field),
				},
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ARTIST_SONGS)({
				parse: getResultRowCount,
				variables: {
					artistID: parent.artistID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
				},
			})
		),
	)

export const albums =
	resolver<Album[], OrderByArgs>(
		({ parent, args, context }) => (
			query(context.pg)(SELECT_ARTIST_ALBUMS_ORDER_BY)({
				parse: convertTableToCamelCase(),
				variables: {
					artistID: parent.artistID,
					orderByField: args.orderBy.field,
					orderByDirection: args.orderBy.direction,
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})
		),
	)

export const albumsTotal =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ARTIST_ALBUMS)({
				parse: getResultRowCount,
				variables: {
					artistID: parent.artistID,
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})
		),
	)

export const since =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ARTIST_ALBUMS_ORDER_BY)({
				parse: pipe(
					convertTableToCamelCase<Album>(),
					head(),
					({ released }) => released,
				),
				variables: {
					orderByDirection: "ASC",
					orderByField: "released",
					artistID: parent.artistID,
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
				},
			})
		),
	)

interface GetUserArtistPlays<T>
	extends UserID, ArtistID, GetObjectsOptions<T> {}

const getUserArtistPlays =
	(client: PoolOrClient) =>
		<T>({ userID, artistID, parse, columnNames }: GetUserArtistPlays<T>) =>
			query(client)(SELECT_OBJECT_SONG_PLAYS)({
				parse,
				variables: {
					userID,
					artistID,
					columnNames,
				},
			})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserArtistPlays(context.pg)({
				artistID: parent.artistID,
				columnNames: join(COLUMN_NAMES.PLAY),
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserArtistPlays(context.pg)({
				artistID: parent.artistID,
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
				objectID: parent.artistID,
				tableName: "library_artists",
				columnName: COLUMN_NAMES.ARTIST[0],
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		({ parent, context }) => (
			getObjectInLibrary(context.pg)({
				objectID: parent.artistID,
				tableName: "library_artists",
				columnName: COLUMN_NAMES.ARTIST[0],
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