import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	addPrefix,
	convertTableToCamelCase,
	getResultCount,
	getResultCountOrNull,
	getResultExists,
	getResultSum,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import ms from "ms";

import { Album, Artist, Genre, Song } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";
import { determineRedisAlbumsKey, pgEpochToJS, redisHandler } from "../helpers/index.js";

const isf = importSQL(import.meta.url);

const SELECT_ALBUM_SONGS = await isf("select-songs");
const SELECT_ALBUM_GENRES = await isf("select-genres");
const SELECT_ALBUM_ARTISTS = await isf("select-artists");
const SELECT_ALBUM_REMIXERS = await isf("select-remixers");
const SELECT_ALBUM_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_ALBUM_SONGS_COUNT = await isf("select-songs-count");
const SELECT_ALBUM_IS_IN_LIBRARY = await isf("select-is-in-library");
const SELECT_ALBUM_USER_PLAYS_COUNT = await isf("select-user-plays-count");
const SELECT_ALBUM_SONGS_DURATION_SUM = await isf("select-songs-duration-sum");

const resolver = createParentResolver<Album>();

export const released = resolver(({ parent }) => Promise.resolve(pgEpochToJS(parent.released)));

export const songs = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "songs"), () =>
		query(context.pg)(SELECT_ALBUM_SONGS)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				albumID: parent.albumID,
				columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			},
		}),
	),
);

export const duration = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "duration"), () =>
		query(context.pg)(SELECT_ALBUM_SONGS_DURATION_SUM)({
			parse: getResultSum,
			variables: { albumID: parent.albumID },
		}),
	),
);

export const songsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "songs-total"), () =>
		query(context.pg)(SELECT_ALBUM_SONGS_COUNT)({
			parse: getResultCount,
			variables: { albumID: parent.albumID },
		}),
	),
);

export const artists = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "artists"), () =>
		query(context.pg)(SELECT_ALBUM_ARTISTS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				albumID: parent.albumID,
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
			},
		}),
	),
);

export const remixers = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "remixers"), () =>
		query(context.pg)(SELECT_ALBUM_REMIXERS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				albumID: parent.albumID,
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
			},
		}),
	),
);

export const genres = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(parent.albumID, "genres"), () =>
		query(context.pg)(SELECT_ALBUM_GENRES)({
			parse: convertTableToCamelCase<Genre>(),
			variables: {
				albumID: parent.albumID,
				columnNames: addPrefix(COLUMN_NAMES.GENRE, "genres"),
			},
		}),
	),
);

export const playsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisAlbumsKey(parent.albumID, "plays-total"),
		() =>
			query(context.pg)(SELECT_ALBUM_PLAYS_COUNT)({
				parse: getResultCountOrNull,
				variables: {
					albumID: parent.albumID,
				},
			}),
		ms("30m"),
	),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ALBUM_USER_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			albumID: parent.albumID,
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const inLibrary = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ALBUM_IS_IN_LIBRARY)({
		parse: getResultExists,
		variables: {
			albumID: parent.albumID,
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);
