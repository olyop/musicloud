import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { ForbiddenError } from "apollo-server-fastify"
import { SongID, AlbumID, UserID } from "@oly_op/music-app-common/types"

import {
	SELECT_USER_PLAYS,
	SELECT_USER_PLAYLISTS,
	SELECT_USER_PLAYLISTS_FILTERED,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import { Play, User, Playlist, GetObjectsOptions } from "../types"
import { createResolver, ResolverCallback, ResolverParameter } from "./helpers"

const resolver =
	createResolver<User>()

const checkAuthorization =
	<A, R>(callback: ResolverCallback<User, A, R>) =>
		(parameter: ResolverParameter<User, A>) => {
			if (parameter.parent.userID === parameter.context.authorization!.userID) {
				return callback(parameter)
			} else {
				throw new ForbiddenError("Unauthorized access to this user")
			}
		}

export const dateJoined =
	resolver<number>(
		({ parent }) => parent.dateJoined * 1000,
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

interface GetUserPlaylistsOptions<T>
	extends UserID, GetObjectsOptions<T> {}

const getUserPlaylists =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetUserPlaylistsOptions<T>) =>
			query(client)(SELECT_USER_PLAYLISTS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const playlists =
	resolver(
		checkAuthorization(
			({ parent, context }) => (
				getUserPlaylists(context.pg)({
					userID: parent.userID,
					parse: convertTableToCamelCaseOrNull<Playlist>(),
					columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
				})
			),
		),
	)

export const playlistsTotal =
	resolver(
		checkAuthorization(
			({ parent, context }) => (
				getUserPlaylists(context.pg)({
					userID: parent.userID,
					parse: getResultRowCountOrNull,
					columnNames: `playlists.${COLUMN_NAMES.PLAYLIST[0]}`,
				})
			),
		),
	)

export const playlistsFilteredBySong =
	resolver<Playlist[], SongID>(
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
	resolver<Playlist[], AlbumID>(
		checkAuthorization(
			({ parent, args, context }) => (
				query(context.pg)("")({
					parse: convertTableToCamelCase(),
				})
			),
		),
	)