import {
	join,
	query,
	PoolOrClient,
	getResultExists,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { SongID, AlbumID, UserID } from "@oly_op/musicloud-common"
import { ApolloError, ForbiddenError } from "apollo-server-errors"

import {
	SELECT_USER_PLAYS,
	EXISTS_USER_FOLLOWER,
	SELECT_USER_FOLLOWERS,
	SELECT_USER_PLAYLISTS,
	SELECT_USER_PLAYLISTS_FILTERED,
} from "../sql"

import { COLUMN_NAMES } from "../globals"
import createParentResolver from "./create-parent-resolver"
import { Play, User, Playlist, GetObjectsOptions } from "../types"
import { timeStampToMilliseconds } from "./helpers"

interface GetUserObjectsOptions<T>
	extends UserID, GetObjectsOptions<T> {}

const resolver =
	createParentResolver<User>(
		({ parent, context }) => {
			if (parent.userID !== context.authorization!.userID) {
				throw new ForbiddenError("Unauthorized access to this user")
			}
		},
	)

export const dateJoined =
	resolver(
		({ parent }) => (
			Promise.resolve(
				timeStampToMilliseconds(parent.dateJoined),
			)
		),
		{ parent: false },
	)

export const plays =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_USER_PLAYS)({
				parse: convertTableToCamelCase<Play>(),
				variables: { userID: parent.userID },
			})
		),
	)

export const isFollowing =
	resolver<boolean>(
		({ parent, context }) => (
			query(context.pg)(EXISTS_USER_FOLLOWER)({
				parse: getResultExists,
				variables: {
					userID: parent.userID,
					followerUserID: context.authorization!.userID,
				},
			})
		),
		{ parent: false },
	)

export const isFollower =
	resolver<boolean>(
		({ parent, context }) => (
			query(context.pg)(EXISTS_USER_FOLLOWER)({
				parse: getResultExists,
				variables: {
					followerUserID: parent.userID,
					userID: context.authorization!.userID,
				},
			})
		),
		{ parent: false },
	)

export const followers =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_USER_FOLLOWERS)({
				parse: convertTableToCamelCase<User>(),
				variables: {
					userID: parent.userID,
					columnNames: join(COLUMN_NAMES.USER, "users"),
				},
			})
		),
		{ parent: false },
	)

const getUserPlaylists =
	(pg: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetUserObjectsOptions<T>) =>
			query(pg)(SELECT_USER_PLAYLISTS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const playlists =
	resolver(
		({ parent, context }) => (
			getUserPlaylists(context.pg)({
				userID: parent.userID,
				parse: convertTableToCamelCaseOrNull<Playlist>(),
				columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
			})
		),
	)

export const playlistsTotal =
	resolver(
		({ parent, context }) => (
			getUserPlaylists(context.pg)({
				userID: parent.userID,
				parse: getResultRowCountOrNull,
				columnNames: `playlists.${COLUMN_NAMES.PLAYLIST[0]}`,
			})
		),
	)

export const playlistsFilteredBySong =
	resolver<Playlist[], SongID>(
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
	)

export const playlistsFilteredByAlbum =
	resolver<Playlist[], AlbumID>(
		() => {
			throw new ApolloError("Not implemented yet.")
		},
		// ({ context }) => (
		// 	query(context.pg)("SE")({
		// 		parse: convertTableToCamelCase(),
		// 	})
		// ),
	)