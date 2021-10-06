import {
	join,
	query,
	PoolOrClient,
	getResultRowCount,
	getResultRowCountOrNull,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import { sum } from "lodash"
import pipe from "@oly_op/pipe"
import { map } from "lodash/fp"

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
	SELECT_USER_ALBUM_PLAYS,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import { createResolver } from "./helpers"

const resolver =
	createResolver<Album>()

const getSongs =
	(client: PoolOrClient) =>
		<T>({ objectID, parse }: GetObjectsOptions<T>) =>
			query(client)(SELECT_ALBUM_SONGS)({
				parse,
				variables: {
					albumID: objectID,
					columnNames: join(COLUMN_NAMES.SONG),
				},
			})

export const songs =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.albumID,
				parse: convertTableToCamelCase<Song>(),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.albumID,
				parse: getResultRowCount,
			})
		),
	)

export const duration =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.albumID,
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

const getUserPlays =
	(client: PoolOrClient) =>
		(userID: string) =>
			<T>({ objectID, parse }: GetObjectsOptions<T>) =>
				query(client)(SELECT_USER_ALBUM_PLAYS)({
					parse,
					variables: {
						userID,
						albumID: objectID,
						columnNames: join(COLUMN_NAMES.PLAY),
					},
				})

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.albumID,
				parse: convertTableToCamelCase<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				parse: getResultRowCount,
				objectID: parent.albumID,
			})
		),
	)