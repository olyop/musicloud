import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NAME } from "@oly_op/musicloud-common/build/metadata";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, SongID, UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertFirstRowToCamelCase,
	convertTableToCamelCase,
	convertTableToCamelCaseOrNull,
	getResultCountOrNull,
	getResultRowCountOrNull,
	importSQL,
	isResultEmpty,
	query,
} from "@oly_op/pg-helpers";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import { pipe } from "rxjs";

import { SELECT_OBJECT_SONG_PLAYS, SELECT_PLAYLIST_SONG } from "../../sql";
import { Artist, Genre, GetObjectsOptions, Play, PlaylistSong, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import {
	getAlbum,
	getKey,
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
	timeStampToMilliseconds,
} from "../helpers";

const isf = importSQL(import.meta.url);

const SELECT_SONG_GENRES = await isf("select-genres");
const SELECT_SONG_ARTISTS = await isf("select-artists");
const SELECT_SONG_REMIXERS = await isf("select-remixers");
const SELECT_SONG_FEATURING = await isf("select-featuring");
const SELECT_SONG_PLAYS_COUNT = await isf("select-plays-count");

const resolver = createParentResolver<Song>();

export const size = resolver(async ({ parent, context }) => {
	const songID = removeDashesFromUUID(parent.songID);
	const Key = `catalog/${songID}/audio/index.mp3`;
	const command = new GetObjectCommand({ Bucket: NAME, Key });
	const content = await context.s3.send(command);
	return content.ContentLength ?? null;
});

export const key = resolver(({ parent, context }) => getKey(context.pg)({ keyID: parent.keyID }));

export const album = resolver(({ parent, context }) =>
	getAlbum(context.pg)({ albumID: parent.albumID }),
);

export const genres = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_GENRES)({
		parse: convertTableToCamelCase<Genre>(),
		variables: {
			songID: parent.songID,
			columnNames: addPrefix(COLUMN_NAMES.GENRE, "genres"),
		},
	}),
);

export const artists = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_ARTISTS)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const remixers = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_REMIXERS)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const featuring = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_FEATURING)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: addPrefix(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const playsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			songID: parent.songID,
			columnNames: addPrefix(COLUMN_NAMES.PLAY),
		},
	}),
);

interface GetUserSongPlaysOptions<T> extends UserID, SongID, GetObjectsOptions<T> {}

const getUserSongPlays =
	(client: PoolOrClient) =>
	<T>({ userID, songID, columnNames, parse }: GetUserSongPlaysOptions<T>) =>
		query(client)(SELECT_OBJECT_SONG_PLAYS)({
			parse,
			variables: {
				userID,
				songID,
				columnNames,
			},
		});

export const userPlays = resolver(({ parent, context }) =>
	getUserSongPlays(context.pg)({
		songID: parent.songID,
		columnNames: addPrefix(COLUMN_NAMES.PLAY),
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		parse: convertTableToCamelCaseOrNull<Play>(),
	}),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	getUserSongPlays(context.pg)({
		songID: parent.songID,
		parse: getResultRowCountOrNull,
		columnNames: COLUMN_NAMES.PLAY[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
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

interface GetSongPlaylistSongOptions<T> extends SongID, PlaylistID, GetObjectsOptions<T> {}

const getSongPlaylistSong =
	(client: PoolOrClient) =>
	<T>({ songID, playlistID, columnNames, parse }: GetSongPlaylistSongOptions<T>) =>
		query(client)(SELECT_PLAYLIST_SONG)({
			parse,
			variables: {
				songID,
				playlistID,
				columnNames,
			},
		});

export const playlistIndex = resolver<number, PlaylistID>(({ parent, context, args }) =>
	getSongPlaylistSong(context.pg)({
		songID: parent.songID,
		playlistID: args.playlistID,
		columnNames: join(COLUMN_NAMES.PLAYLIST_SONG),
		parse: pipe(convertFirstRowToCamelCase<PlaylistSong>(), ({ index }) => index),
	}),
);

export const isInPlaylist = resolver<boolean, PlaylistID>(({ parent, context, args }) =>
	getSongPlaylistSong(context.pg)({
		songID: parent.songID,
		playlistID: args.playlistID,
		parse: result => !isResultEmpty(result),
		columnNames: join(COLUMN_NAMES.PLAYLIST_SONG),
	}),
);

export const dateAddedToPlaylist = resolver<number | null, PlaylistID>(
	({ parent, context, args }) =>
		getSongPlaylistSong(context.pg)({
			songID: parent.songID,
			playlistID: args.playlistID,
			columnNames: COLUMN_NAMES.PLAYLIST_SONG[0],
			parse: result =>
				result.rowCount === 0
					? null
					: pipe(
							convertFirstRowToCamelCase<PlaylistSong>(),
							({ dateAdded }) => dateAdded,
							timeStampToMilliseconds,
					  )(result),
		}),
);
