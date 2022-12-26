import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistPrivacy } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertTableToCamelCaseOrNull,
	getResultCountOrNull,
	getResultSumOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Playlist, Song } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";
import {
	determineRedisPlaysKey,
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
	getUser,
	pgEpochToJS,
	redisHandler,
} from "../helpers/index.js";

const isf = importSQL(import.meta.url);

const SELECT_PLAYLIST_SONGS = await isf("select-songs");
const SELECT_PLAYLIST_SONGS_COUNT = await isf("select-songs-count");
const SELECT_PLAYLIST_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_PLAYLIST_USER_PLAYS_COUNT = await isf("select-user-plays-count");
const SELECT_PLAYLIST_SONGS_DURATION_SUM = await isf("select-songs-duration-sum");

const resolver = createParentResolver<Playlist>(({ parent, context }) => {
	if (
		parent.privacy === PlaylistPrivacy.PRIVATE &&
		parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID
	) {
		throw new Error("Unauthorized access to this playlist");
	}
});

export const dateCreated = resolver(({ parent }) =>
	Promise.resolve(pgEpochToJS(parent.dateCreated)),
);

export const user = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisPlaysKey(parent.playlistID, "user"), () =>
		getUser(context.pg)({ userID: parent.userID }),
	),
);

export const duration = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_SONGS_DURATION_SUM)({
		parse: getResultSumOrNull,
		variables: {
			playlistID: parent.playlistID,
		},
	}),
);

export const songs = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_SONGS)({
		parse: convertTableToCamelCaseOrNull<Song>(),
		variables: {
			playlistID: parent.playlistID,
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
		},
	}),
);

export const songsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_SONGS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			playlistID: parent.playlistID,
		},
	}),
);

export const playsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			playlistID: parent.playlistID,
		},
	}),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_USER_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			playlistID: parent.playlistID,
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const dateAddedToLibrary = resolver(({ parent, context }) =>
	getObjectDateAddedToLibrary(context.pg)({
		objectID: parent.playlistID,
		tableName: "library_playlists",
		columnName: COLUMN_NAMES.PLAYLIST[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const inLibrary = resolver(({ parent, context }) =>
	getObjectInLibrary(context.pg)({
		objectID: parent.playlistID,
		tableName: "library_playlists",
		columnName: COLUMN_NAMES.PLAYLIST[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);
