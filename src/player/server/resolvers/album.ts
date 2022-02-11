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
import { sum } from "lodash-es"
import { UserID, AlbumID } from "@oly_op/music-app-common/types"

import {
	Song,
	Play,
	Album,
	Genre,
	Artist,
	GetObjectsOptions,
} from "../types"

import {
	SELECT_ALBUM_PLAYS,
	SELECT_ALBUM_SONGS,
	SELECT_ALBUM_GENRES,
	SELECT_ALBUM_ARTISTS,
	SELECT_ALBUM_REMIXERS,
	SELECT_USER_ALBUM_PLAYS,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import { map, getObjectInLibrary } from "./helpers"
import createParentResolver from "./create-parent-resolver"

const resolver =
	createParentResolver<Album>()

interface GetAlbumSongsOptions<T>
	extends AlbumID, GetObjectsOptions<T> {}

const getAlbumSongs =
	(client: PoolOrClient) =>
		<T>({ albumID, columnNames, parse }: GetAlbumSongsOptions<T>) =>
			query(client)(SELECT_ALBUM_SONGS)({
				parse,
				variables: {
					albumID,
					columnNames,
				},
			})

export const songs =
	resolver(
		({ parent, context }) => (
			getAlbumSongs(context.pg)({
				albumID: parent.albumID,
				columnNames: join(COLUMN_NAMES.SONG),
				parse: convertTableToCamelCase<Song>(),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getAlbumSongs(context.pg)({
				albumID: parent.albumID,
				parse: getResultRowCount,
				columnNames: COLUMN_NAMES.SONG[0],
			})
		),
	)

export const duration =
	resolver(
		({ parent, context }) => (
			getAlbumSongs(context.pg)({
				columnNames: "duration",
				albumID: parent.albumID,
				parse: pipe(
					convertTableToCamelCase<Song>(),
					map(song => song.duration),
					sum,
				),
			})
		),
	)

export const released =
	resolver(
		({ parent }) => (
			Promise.resolve(
				new Date(
					parent.released.getFullYear(),
					parent.released.getMonth() - 1,
					parent.released.getDate() + 1,
				),
			)
		),
	)

export const artists =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ALBUM_ARTISTS)({
				parse: convertTableToCamelCase<Artist>(),
				variables: {
					albumID: parent.albumID,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
				},
			})
		),
	)

export const remixers =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ALBUM_REMIXERS)({
				parse: convertTableToCamelCase<Artist>(),
				variables: {
					albumID: parent.albumID,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
				},
			})
		),
	)

export const genres =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ALBUM_GENRES)({
				parse: convertTableToCamelCase<Genre>(),
				variables: {
					albumID: parent.albumID,
					columnNames: join(COLUMN_NAMES.GENRE, "genres"),
				},
			})
		),
	)

export const playsTotal =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_ALBUM_PLAYS)({
				parse: getResultRowCountOrNull,
				variables: {
					albumID: parent.albumID,
				},
			})
		),
	)

interface GetUserAlbumPlaysOptions<T>
	extends UserID, AlbumID, GetObjectsOptions<T> {}

const getUserAlbumPlays =
	(client: PoolOrClient) =>
		<T>({ userID, albumID, columnNames, parse }: GetUserAlbumPlaysOptions<T>) =>
			query(client)(SELECT_USER_ALBUM_PLAYS)({
				parse,
				variables: {
					userID,
					albumID,
					columnNames,
				},
			})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserAlbumPlays(context.pg)({
				albumID: parent.albumID,
				columnNames: join(COLUMN_NAMES.PLAY),
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserAlbumPlays(context.pg)({
				albumID: parent.albumID,
				parse: getResultRowCountOrNull,
				columnNames: COLUMN_NAMES.PLAY[0],
				userID: context.authorization!.userID,
			})
		),
	)

export const inLibrary =
	resolver(
		async ({ parent, context }) => {
			const albumSongs =
				await getAlbumSongs(context.pg)({
					albumID: parent.albumID,
					columnNames: COLUMN_NAMES.SONG[0],
					parse: convertTableToCamelCase<Song>(),
				})
			const songsInLibrary =
				await Promise.all(
					albumSongs.map(
						({ songID }) => (
							getObjectInLibrary(context.pg)({
								objectID: songID,
								tableName: "library_songs",
								columnName: COLUMN_NAMES.SONG[0],
								userID: context.authorization!.userID,
							})
						),
					),
				)
			return songsInLibrary.every(Boolean)
		},
	)