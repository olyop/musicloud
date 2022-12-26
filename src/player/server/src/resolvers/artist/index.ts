import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	addPrefix,
	convertFirstRowToCamelCase,
	convertTableToCamelCase,
	getResultCount,
	getResultCountOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import ms from "ms";
import { pipe } from "rxjs";

import { Album, Artist, OrderByArgs, Song } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";
import {
	determineRedisArtistsKey,
	determineSongsSQLOrderByField,
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
	pgEpochToJS,
	redisHandler,
} from "../helpers/index.js";

const isf = importSQL(import.meta.url);

const SELECT_ARTIST_SINCE = await isf("select-since");
const SELECT_ARTIST_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_ARTIST_SONGS_COUNT = await isf("select-songs-count");
const SELECT_ARTIST_ALBUMS_COUNT = await isf("select-albums-count");
const SELECT_ARTIST_SONGS_ORDERED = await isf("select-songs-ordered");
const SELECT_ARTIST_ALBUMS_ORDERED = await isf("select-albums-ordered");
const SELECT_ARTIST_SONGS_TOP_TEN = await isf("select-songs-top-ten");
const SELECT_ARTIST_USER_PLAYS_COUNT = await isf("select-user-plays-count");

const resolver = createParentResolver<Artist>();

export const since = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisArtistsKey(parent.artistID, "since"),
		query(context.pg)(SELECT_ARTIST_SINCE)({
			parse: pipe(convertFirstRowToCamelCase<Album>(), ({ released }) => released, pgEpochToJS),
			variables: {
				artistID: parent.artistID,
			},
		}),
	),
);

export const songsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisArtistsKey(parent.artistID, "songs-total"),
		query(context.pg)(SELECT_ARTIST_SONGS_COUNT)({
			parse: getResultCount,
			variables: {
				artistID: parent.artistID,
			},
		}),
	),
);

export const albumsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisArtistsKey(parent.artistID, "albums-total"),
		query(context.pg)(SELECT_ARTIST_ALBUMS_COUNT)({
			parse: getResultCount,
			variables: {
				artistID: parent.artistID,
			},
		}),
	),
);

export const albums = resolver<Album[], OrderByArgs>(({ parent, args, context }) =>
	query(context.pg)(SELECT_ARTIST_ALBUMS_ORDERED)({
		parse: convertTableToCamelCase(),
		variables: {
			artistID: parent.artistID,
			orderByField: [args.orderBy.field],
			orderByDirection: [args.orderBy.direction],
			columnNames: addPrefix(COLUMN_NAMES.ALBUM, "albums"),
		},
	}),
);

export const songs = resolver<Song[], OrderByArgs>(({ parent, args, context }) =>
	query(context.pg)(SELECT_ARTIST_SONGS_ORDERED)({
		parse: convertTableToCamelCase(),
		variables: {
			artistID: parent.artistID,
			orderByDirection: [args.orderBy.direction],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			orderByField: [determineSongsSQLOrderByField(args.orderBy.field)],
		},
	}),
);

export const playsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisArtistsKey(parent.artistID, "plays-total"),
		query(context.pg)(SELECT_ARTIST_PLAYS_COUNT)({
			parse: getResultCountOrNull,
			variables: {
				artistID: parent.artistID,
			},
		}),
		ms("30m"),
	),
);

export const topTenSongs = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisArtistsKey(parent.artistID, "top-ten-songs"),
		query(context.pg)(SELECT_ARTIST_SONGS_TOP_TEN)({
			parse: convertTableToCamelCase<Song>(),
			variables: {
				artistID: parent.artistID,
				columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			},
		}),
		ms("30m"),
	),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_USER_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			artistID: parent.artistID,
		},
	}),
);

export const dateAddedToLibrary = resolver(({ parent, context }) =>
	getObjectDateAddedToLibrary(context.pg)({
		objectID: parent.artistID,
		tableName: "library_artists",
		columnName: COLUMN_NAMES.ARTIST[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const inLibrary = resolver(({ parent, context }) =>
	getObjectInLibrary(context.pg)({
		objectID: parent.artistID,
		tableName: "library_artists",
		columnName: COLUMN_NAMES.ARTIST[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);
