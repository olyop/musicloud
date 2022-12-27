import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { SongID } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertTableToCamelCase,
	convertTableToCamelCaseOrNull,
	getResultCount,
	getResultCountOrNull,
	getResultExists,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Playlist, User } from "../../types/index.js";
import { determineRedisUsersKey, pgEpochToJS, redisHandler } from "../helpers/index.js";
import resolver from "./resolver.js";

const isf = importSQL(import.meta.url);

const EXISTS_USER_FOLLOWER = await isf("exists-follower");
const SELECT_USER_FOLLOWERS = await isf("select-followers");
const SELECT_USER_PLAYLISTS = await isf("select-playlists");
const SELECT_USER_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_USER_PLAYLISTS_COUNT = await isf("select-playlists-count");
const SELECT_USER_PLAYLISTS_FILTERED_BY_SONG = await isf("select-playlists-filtered-by-song");

export const dateJoined = resolver(
	({ parent, context }) =>
		redisHandler(context.redis)(
			determineRedisUsersKey(parent.userID, "date-joined"),
			Promise.resolve(pgEpochToJS(parent.dateJoined)),
		),
	{ parent: false },
);

export const isFollowing = resolver(
	({ parent, context }) =>
		query(context.pg)(EXISTS_USER_FOLLOWER)({
			parse: getResultExists,
			variables: {
				userID: parent.userID,
				followerUserID: context.getAuthorizationJWTPayload(context.authorization).userID,
			},
		}),
	{ parent: false },
);

export const isFollower = resolver(
	({ parent, context }) =>
		query(context.pg)(EXISTS_USER_FOLLOWER)({
			parse: getResultExists,
			variables: {
				followerUserID: parent.userID,
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
			},
		}),
	{ parent: false },
);

export const followers = resolver(
	({ parent, context }) =>
		query(context.pg)(SELECT_USER_FOLLOWERS)({
			parse: convertTableToCamelCase<User>(),
			variables: {
				userID: parent.userID,
				columnNames: addPrefix(COLUMN_NAMES.USER, "users"),
			},
		}),
	{ parent: false },
);

export const playsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_USER_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: { userID: parent.userID },
	}),
);

export const playlists = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_USER_PLAYLISTS)({
		parse: convertTableToCamelCaseOrNull<Playlist>(),
		variables: {
			userID: parent.userID,
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
		},
	}),
);

export const playlistsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_USER_PLAYLISTS_COUNT)({
		parse: getResultCount,
		variables: {
			userID: parent.userID,
		},
	}),
);

export const playlistsFilteredBySong = resolver<Playlist[], SongID>(({ parent, args, context }) =>
	query(context.pg)(SELECT_USER_PLAYLISTS_FILTERED_BY_SONG)({
		parse: convertTableToCamelCase(),
		variables: {
			songID: args.songID,
			userID: parent.userID,
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
		},
	}),
);
