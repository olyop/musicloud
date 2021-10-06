import {
	join,
	query,
	Result,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	UserIDBase,
	PlayIDBase,
	SongIDBase,
	AlbumIDBase,
	GenreIDBase,
	ArtistIDBase,
	PlaylistIDBase,
} from "@oly_op/music-app-common/types"

import { isEmpty } from "lodash"
import { UserInputError } from "apollo-server-fastify"

import {
	User,
	Song,
	Play,
	Album,
	Genre,
	Artist,
	Playlist,
} from "../../types"

import {
	SELECT_USER_BY_ID,
	SELECT_SONG_BY_ID,
	SELECT_PLAY_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_GENRE_BY_ID,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

const convertFirstRowToCamelCaseOrError =
	<T>(typeName: string) =>
		(result: Result) => {
			if (isEmpty(result.rows)) {
				throw new UserInputError(`${typeName} does not exist.`)
			} else {
				return convertFirstRowToCamelCase<T>()(result)
			}
		}

const resolver =
	createResolver()

export const user =
	resolver<User, Partial<UserIDBase>>(
		({ args, context }) => (
			query(context.pg)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("User"),
				variables: {
					columnNames: join(COLUMN_NAMES.USER),
					userID: args.userID || context.authorization!.userID,
				},
			})
		),
	)

export const song	=
	resolver<Song, SongIDBase>(
		({ args, context }) => (
			query(context.pg)(SELECT_SONG_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Song"),
				variables: {
					songID: args.songID,
					columnNames: join(COLUMN_NAMES.SONG),
				},
			})
		),
	)

export const play =
	resolver<Play, PlayIDBase>(
		({ args, context }) => (
			query(context.pg)(SELECT_PLAY_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Play"),
				variables: {
					playID: args.playID,
					columnNames: join(COLUMN_NAMES.PLAY),
				},
			})
		),
	)

export const album =
	resolver<Album, AlbumIDBase>(
		({ args, context }) => (
			query(context.pg)(SELECT_ALBUM_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Album"),
				variables: {
					albumID: args.albumID,
					columnNames: join(COLUMN_NAMES.ALBUM),
				},
			})
		),
	)

export const genre =
	resolver<Genre, GenreIDBase>(
		({ args, context }) => (
			query(context.pg)(SELECT_GENRE_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Genre"),
				variables: {
					genreID: args.genreID,
					columnNames: join(COLUMN_NAMES.GENRE),
				},
			})
		),
	)

export const artist =
	resolver<Artist, ArtistIDBase>(
		async ({ args, context }) => (
			query(context.pg)(SELECT_ARTIST_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Artist"),
				variables: {
					artistID: args.artistID,
					columnNames: join(COLUMN_NAMES.ARTIST),
				},
			})
		),
	)

export const playlist =
	resolver<Playlist, PlaylistIDBase>(
		async ({ args, context }) => (
			query(context.pg)(SELECT_PLAYLIST_BY_ID)({
				parse: convertFirstRowToCamelCaseOrError("Playlist"),
				variables: {
					playlistID: args.playlistID,
					columnNames: join(COLUMN_NAMES.PLAYLIST),
				},
			})
		),
	)