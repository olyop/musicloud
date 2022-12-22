import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NAME } from "@oly_op/musicloud-common/build/metadata";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertFirstRowToCamelCaseOrNull,
	convertTableToCamelCase,
	getResultCountOrNull,
	getResultExists,
	getResultRowCountOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import ms from "ms";
import { pipe } from "rxjs";

import { Artist, Genre, PlaylistSong, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import {
	determineRedisSongsKey,
	getAlbum,
	getKey,
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
	pgEpochToJS,
	redisHandler,
} from "../helpers";

const isf = importSQL(import.meta.url);

const SELECT_SONG_GENRES = await isf("select-genres");
const SELECT_SONG_ARTISTS = await isf("select-artists");
const SELECT_SONG_REMIXERS = await isf("select-remixers");
const SELECT_SONG_FEATURING = await isf("select-featuring");
const SELECT_SONG_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_SONG_PLAYLIST_SONG = await isf("select-playlist-song");
const EXISTS_SONG_IS_IN_PLAYLIST = await isf("exists-is-in-playlist");
const SELECT_SONG_USER_PLAYS_COUNT = await isf("select-user-plays-count");

const resolver = createParentResolver<Song>();

export const size = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "size"), async () => {
		const songID = removeDashesFromUUID(parent.songID);
		const Key = `catalog/${songID}/audio/index.mp3`;
		const command = new GetObjectCommand({ Bucket: NAME, Key });
		const content = await context.s3.send(command);
		return content.ContentLength ?? null;
	}),
);

export const key = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "key"), () =>
		getKey(context.pg)({ keyID: parent.keyID }),
	),
);

export const album = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "album"), () =>
		getAlbum(context.pg)({ albumID: parent.albumID }),
	),
);

export const genres = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "genres"), () =>
		query(context.pg)(SELECT_SONG_GENRES)({
			parse: convertTableToCamelCase<Genre>(),
			variables: {
				songID: parent.songID,
				columnNames: addPrefix(COLUMN_NAMES.GENRE, "genres"),
			},
		}),
	),
);

export const artists = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "artists"), () =>
		query(context.pg)(SELECT_SONG_ARTISTS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				songID: parent.songID,
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
			},
		}),
	),
);

export const remixers = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "remixers"), () =>
		query(context.pg)(SELECT_SONG_REMIXERS)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				songID: parent.songID,
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
			},
		}),
	),
);

export const featuring = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(parent.songID, "featuring"), () =>
		query(context.pg)(SELECT_SONG_FEATURING)({
			parse: convertTableToCamelCase<Artist>(),
			variables: {
				songID: parent.songID,
				columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
			},
		}),
	),
);

export const playsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisSongsKey(parent.songID, "plays-total"),
		() =>
			query(context.pg)(SELECT_SONG_PLAYS_COUNT)({
				parse: getResultCountOrNull,
				variables: {
					songID: parent.songID,
				},
			}),
		ms("30m"),
	),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_USER_PLAYS_COUNT)({
		parse: getResultRowCountOrNull,
		variables: {
			songID: parent.songID,
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);

export const dateAddedToLibrary = resolver(({ parent, context }) =>
	getObjectDateAddedToLibrary(context.pg)({
		objectID: parent.songID,
		tableName: "library_songs",
		columnName: COLUMN_NAMES.SONG[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const inLibrary = resolver(({ parent, context }) =>
	getObjectInLibrary(context.pg)({
		objectID: parent.songID,
		tableName: "library_songs",
		columnName: COLUMN_NAMES.SONG[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const playlistIndex = resolver<number | null, PlaylistID>(({ parent, context, args }) =>
	query(context.pg)(SELECT_SONG_PLAYLIST_SONG)({
		parse: pipe(
			convertFirstRowToCamelCaseOrNull<PlaylistSong>(),
			playlistSong => playlistSong?.index ?? null,
		),
		variables: {
			songID: parent.songID,
			playlistID: args.playlistID,
		},
	}),
);

export const isInPlaylist = resolver<boolean, PlaylistID>(({ parent, context, args }) =>
	query(context.pg)(EXISTS_SONG_IS_IN_PLAYLIST)({
		parse: getResultExists,
		variables: {
			songID: parent.songID,
			playlistID: args.playlistID,
		},
	}),
);

export const dateAddedToPlaylist = resolver<number | null, PlaylistID>(
	({ parent, context, args }) =>
		query(context.pg)(SELECT_SONG_PLAYLIST_SONG)({
			parse: pipe(convertFirstRowToCamelCaseOrNull<PlaylistSong>(), playlistSong =>
				playlistSong ? pgEpochToJS(playlistSong.dateAdded) : null,
			),
			variables: {
				songID: parent.songID,
				playlistID: args.playlistID,
			},
		}),
);
