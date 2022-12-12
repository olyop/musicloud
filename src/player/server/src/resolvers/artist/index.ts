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
import { pipe } from "rxjs";

import { Album, Artist, OrderByArgs, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import {
	determineSongsSQLOrderByField,
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
} from "../helpers";

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

export const city = resolver(({ parent }) => Promise.resolve(parent.city));

export const country = resolver(({ parent }) => Promise.resolve(parent.country));

export const since = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_SINCE)({
		parse: pipe(convertFirstRowToCamelCase<Album>(), album => album.released),
		variables: {
			artistID: parent.artistID,
		},
	}),
);

export const playsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			artistID: parent.artistID,
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

export const songsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_SONGS_COUNT)({
		parse: getResultCount,
		variables: {
			artistID: parent.artistID,
		},
	}),
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

export const albumsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_ALBUMS_COUNT)({
		parse: getResultCount,
		variables: {
			artistID: parent.artistID,
		},
	}),
);

export const topTenSongs = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_ARTIST_SONGS_TOP_TEN)({
		parse: convertTableToCamelCase<Song>(),
		variables: {
			artistID: parent.artistID,
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
		},
	}),
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
