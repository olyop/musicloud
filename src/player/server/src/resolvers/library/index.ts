import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	addPrefix,
	convertFirstRowToCamelCaseOrNull,
	getResultCountOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers/build";

import { Album, Artist, Genre, LibraryObjectAtIndexArgs, Playlist, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import { determineSongsSQLOrderByField } from "../helpers";

const isf = importSQL(import.meta.url);

const SELECT_LIBRARY_ALBUMS_COUNT = await isf("select-albums-count");
const SELECT_LIBRARY_ALBUM_AT_INDEX = await isf("select-album-at-index");
const SELECT_LIBRARY_ARTISTS_COUNT = await isf("select-artists-count");
const SELECT_LIBRARY_ARTIST_AT_INDEX = await isf("select-artist-at-index");
const SELECT_LIBRARY_GENRES_COUNT = await isf("select-genres-count");
const SELECT_LIBRARY_GENRE_AT_INDEX = await isf("select-genre-at-index");
const SELECT_LIBRARY_PLAYLISTS_COUNT = await isf("select-playlists-count");
const SELECT_LIBRARY_PLAYLIST_AT_INDEX = await isf("select-playlist-at-index");
const SELECT_LIBRARY_SONGS_COUNT = await isf("select-songs-count");
const SELECT_LIBRARY_SONG_AT_INDEX = await isf("select-song-at-index");

const resolver = createParentResolver<Record<string, unknown>>();

export const songsTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_SONGS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const songAtIndex = resolver<Song | null, LibraryObjectAtIndexArgs>(({ args, context }) =>
	query(context.pg)(SELECT_LIBRARY_SONG_AT_INDEX)({
		parse: convertFirstRowToCamelCaseOrNull(),
		variables: {
			atIndex: [args.input.atIndex],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			orderByDirection: [args.input.orderBy.direction],
			orderByField: [determineSongsSQLOrderByField(args.input.orderBy.field)],
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const genresTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_GENRES_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const genreAtIndex = resolver<Genre | null, LibraryObjectAtIndexArgs>(({ args, context }) =>
	query(context.pg)(SELECT_LIBRARY_GENRE_AT_INDEX)({
		parse: convertFirstRowToCamelCaseOrNull(),
		variables: {
			atIndex: [args.input.atIndex],
			orderByField: [args.input.orderBy.field],
			orderByDirection: [args.input.orderBy.direction],
			columnNames: [addPrefix(COLUMN_NAMES.GENRE, "genres")],
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const artistsTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_ARTISTS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const artistAtIndex = resolver<Artist | null, LibraryObjectAtIndexArgs>(
	({ args, context }) =>
		query(context.pg)(SELECT_LIBRARY_ARTIST_AT_INDEX)({
			parse: convertFirstRowToCamelCaseOrNull(),
			variables: {
				atIndex: [args.input.atIndex],
				orderByField: [args.input.orderBy.field],
				orderByDirection: [args.input.orderBy.direction],
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				orderByTableName: [
					args.input.orderBy.field === "DATE_ADDED" ? "library_artists" : "artists",
				],
			},
		}),
);

export const albumsTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_ALBUMS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const albumAtIndex = resolver<Album | null, LibraryObjectAtIndexArgs>(({ args, context }) =>
	query(context.pg)(SELECT_LIBRARY_ALBUM_AT_INDEX)({
		parse: convertFirstRowToCamelCaseOrNull(),
		variables: {
			atIndex: [args.input.atIndex],
			orderByField: [args.input.orderBy.field],
			orderByDirection: [args.input.orderBy.direction],
			columnNames: addPrefix(COLUMN_NAMES.ALBUM, "albums"),
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const playlistsTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_PLAYLISTS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const playlistAtIndex = resolver<Playlist | null, LibraryObjectAtIndexArgs>(
	({ args, context }) =>
		query(context.pg)(SELECT_LIBRARY_PLAYLIST_AT_INDEX)({
			parse: convertFirstRowToCamelCaseOrNull(),
			variables: {
				atIndex: [args.input.atIndex],
				orderByDirection: [args.input.orderBy.direction],
				columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				orderByField: [
					`${args.input.orderBy.field === "DATE_ADDED" ? "library_playlists" : "playlists"}.${
						args.input.orderBy.field
					}`,
				],
			},
		}),
);
