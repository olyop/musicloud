import {
	join,
	query,
	Parse,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import {
	SongIDBase,
	AlbumIDBase,
	InterfaceWithInput,
	InterfaceWithPartialInput,
} from "@oly_op/music-app-common/types"

import { isNull, isEmpty } from "lodash"
import { ForbiddenError } from "apollo-server-fastify"
import { PAGINATION_PAGE_SIZE } from "@oly_op/music-app-common/globals"

import {
	Song,
	Play,
	User,
	Genre,
	Album,
	Artist,
	PageArgs,
	Playlist,
	OrderByArgs,
	ResolverParameter,
} from "../types"

import {
	getQueueSongs,
	createResolver,
	getQueueSongsFromIDs,
	determineSongsSQLOrderByField,
} from "./helpers"

import {
	SELECT_SONG_BY_ID,
	SELECT_USER_PLAYS,
	SELECT_LIBRARY_SONGS,
	SELECT_LIBRARY_ARTISTS,
	SELECT_LIBRARY_PLAYLISTS,
	SELECT_USER_PLAYLISTS_FILTERED,
	SELECT_LIBRARY_SONGS_PAGINATED,
	SELECT_LIBRARY_ALBUMS_PAGINATED,
	SELECT_LIBRARY_GENRES_PAGINATED,
	SELECT_LIBRARY_ARTISTS_PAGINATED,
	SELECT_LIBRARY_PLAYLISTS_PAGINATED,
} from "../sql"

import { COLUMN_NAMES } from "../globals"

interface LibraryObjectsInput
	extends PageArgs, OrderByArgs {}

type LibraryObjectsArgs =
	InterfaceWithInput<LibraryObjectsInput>

type LibraryObjectsPartialArgs =
	InterfaceWithPartialInput<LibraryObjectsInput>

type Callback<R, A> =
	(arg: ResolverParameter<User, A>) => R | Promise<R>

const resolver =
	createResolver<User>()

const checkAuthorization =
	<R, A>(callback: Callback<R, A>) =>
		(parameter: ResolverParameter<User, A>) => {
			const { parent, context } = parameter
			const queryUserID = parent.userID
			const tokenUserID = context.authorization?.userID
			if (queryUserID === tokenUserID) {
				return callback(parameter)
			} else {
				throw new ForbiddenError("Unauthorized access to this user.")
			}
		}

export const dateJoined =
	resolver<number>(
		({ parent }) => parent.dateJoined * 1000,
	)

export const nowPlaying =
	resolver(
		checkAuthorization(
			({ parent, context }) => (
				isNull(parent.nowPlaying) ? null : (
					query(context.pg)(SELECT_SONG_BY_ID)({
						parse: convertFirstRowToCamelCase<Song>(),
						variables: {
							songID: parent.nowPlaying,
							columnNames: join(COLUMN_NAMES.SONG),
						},
					})
				)
			),
		),
	)

export const queueNext =
	resolver(
		checkAuthorization(
			({ parent, context }) => {
				if (parent.queueNext && !isEmpty(parent.queueNext)) {
					return getQueueSongsFromIDs(context.pg)(
						"queue_nexts",
						parent.queueNext,
					)
				} else {
					return getQueueSongs(context.pg)(parent.userID)("queue_nexts")
				}
			},
		),
	)

export const queueLater =
	resolver(
		checkAuthorization(
			({ parent, context }) => {
				if (parent.queueLater && !isEmpty(parent.queueLater)) {
					return getQueueSongsFromIDs(context.pg)(
						"queue_laters",
						parent.queueLater,
					)
				} else {
					return getQueueSongs(context.pg)(parent.userID)("queue_laters")
				}
			},
		),
	)

export const queuePrevious =
	resolver(
		checkAuthorization(
			({ parent, context }) => {
				if (parent.queuePrevious && !isEmpty(parent.queuePrevious)) {
					return getQueueSongsFromIDs(context.pg)(
						"queue_previous",
						parent.queuePrevious,
					)
				} else {
					return getQueueSongs(context.pg)(parent.userID)("queue_previous")
				}
			},
		),
	)

export const plays =
	resolver(
		checkAuthorization(
			({ parent, context }) => (
				query(context.pg)(SELECT_USER_PLAYS)({
					parse: convertTableToCamelCase<Play>(),
					variables: { userID: parent.userID },
				})
			),
		),
	)

export const libraryAlbums =
	resolver<Album[], LibraryObjectsArgs>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)(SELECT_LIBRARY_ALBUMS_PAGINATED)({
					parse: convertTableToCamelCase(),
					variables: {
						page: args.input.page,
						userID: parent.userID,
						columnNames: join(COLUMN_NAMES.ALBUM),
						paginationPageSize: PAGINATION_PAGE_SIZE,
						orderByDirection: args.input.orderBy?.direction || "ASC",
						orderByField: args.input.orderBy?.field.toLowerCase() || "title",
					},
				})
			),
		),
	)

export const libraryGenres =
	resolver<Genre[], LibraryObjectsArgs>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)(SELECT_LIBRARY_GENRES_PAGINATED)({
					parse: convertTableToCamelCase(),
					variables: {
						page: args.input.page,
						userID: parent.userID,
						columnNames: join(COLUMN_NAMES.GENRE),
						paginationPageSize: PAGINATION_PAGE_SIZE,
						orderByDirection: args.input.orderBy?.direction || "ASC",
						orderByField: args.input.orderBy?.field.toLowerCase() || "name",
					},
				})
			),
		),
	)

export const librarySongs =
	resolver<Song[], LibraryObjectsPartialArgs>(
		checkAuthorization(
			({ parent, args, context }) => (
				args.input ? (
					query(context.pg)(SELECT_LIBRARY_SONGS_PAGINATED)({
						parse: convertTableToCamelCase(),
						variables: {
							page: args.input.page,
							userID: parent.userID,
							paginationPageSize: PAGINATION_PAGE_SIZE,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
							orderByDirection: args.input.orderBy?.direction || "ASC",
							orderByField: determineSongsSQLOrderByField(
								args.input.orderBy?.field.toLowerCase() || "title",
							),
						},
					})
				) : (
					query(context.pg)(SELECT_LIBRARY_SONGS)({
						parse: convertTableToCamelCase(),
						variables: {
							userID: parent.userID,
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})
				)
			),
		),
	)

export const librarySongsTotal =
	resolver<number | null>(
		checkAuthorization(
			({ parent, context }) => (
				query(context.pg)(SELECT_LIBRARY_SONGS)({
					parse: getResultRowCountOrNull,
					variables: {
						userID: parent.userID,
						columnNames: join(COLUMN_NAMES.SONG, "songs"),
					},
				})
			),
		),
	)

export const libraryArtists =
	resolver<Artist[], LibraryObjectsArgs>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)(SELECT_LIBRARY_ARTISTS_PAGINATED)({
					parse: convertTableToCamelCase(),
					variables: {
						page: args.input.page,
						userID: parent.userID,
						paginationPageSize: PAGINATION_PAGE_SIZE,
						columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
						orderByDirection: args.input.orderBy?.direction || "ASC",
						orderByField: args.input.orderBy?.field.toLowerCase() || "title",
						orderByTableName: args.input.orderBy?.field === "DATE_ADDED" ?
							"library_artists" : "artists",
					},
				})
			),
		),
	)

export const libraryArtistsTotal =
	resolver<number | null>(
		checkAuthorization(
			({ parent, context }) => (
				query(context.pg)(SELECT_LIBRARY_ARTISTS)({
					parse: getResultRowCountOrNull,
					variables: { userID: parent.userID },
				})
			),
		),
	)

const getUserPlaylists =
	(client: PoolOrClient) =>
		(userID: string) =>
			<T>(parse: Parse<T>) =>
				query(client)(SELECT_LIBRARY_PLAYLISTS)({
					parse,
					variables: {
						userID,
						columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
					},
				})

export const playlists =
	resolver<Playlist[]>(
		checkAuthorization(
			({ parent, context }) => (
				getUserPlaylists(context.pg)(parent.userID)(
					convertTableToCamelCase(),
				)
			),
		),
	)

export const playlistsTotal =
	resolver<number | null>(
		checkAuthorization(
			({ parent, context }) => (
				getUserPlaylists(context.pg)(parent.userID)(
					getResultRowCountOrNull,
				)
			),
		),
	)

export const playlistsFilteredBySong =
	resolver<Playlist[], SongIDBase>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)(SELECT_USER_PLAYLISTS_FILTERED)({
					parse: convertTableToCamelCase(),
					variables: {
						songID: args.songID,
						userID: parent.userID,
						columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
					},
				})
			),
		),
	)

export const playlistsFilteredByAlbum =
	resolver<Playlist[], AlbumIDBase>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)("")({
					parse: convertTableToCamelCase(),
				})
			),
		),
	)

export const libraryPlaylists =
	resolver<Playlist[], LibraryObjectsArgs>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)(SELECT_LIBRARY_PLAYLISTS_PAGINATED)({
					parse: convertTableToCamelCase(),
					variables: {
						userID: parent.userID,
						page: args.input.page,
						paginationPageSize: PAGINATION_PAGE_SIZE,
						orderByField: args.input.orderBy?.field || "title",
						columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
						orderByDirection: args.input.orderBy?.direction || "ASC",
						orderByTableName: args.input.orderBy?.field === "DATE_ADDED" ?
							"library_playlists" : "playlists",
					},
				})
			),
		),
	)

export const libraryPlaylistsTotal =
	resolver<number | null>(
		checkAuthorization(
			({ parent, context }) => (
				query(context.pg)(SELECT_LIBRARY_PLAYLISTS)({
					parse: getResultRowCountOrNull,
					variables: {
						userID: parent.userID,
						columnNames: join(COLUMN_NAMES.PLAYLIST),
					},
				})
			),
		),
	)