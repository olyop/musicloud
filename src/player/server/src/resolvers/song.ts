import {
	join,
	query,
	PoolOrClient,
	isResultEmpty,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertFirstRowToCamelCase,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers";

import { pipe } from "rxjs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import { NAME } from "@oly_op/musicloud-common/build/metadata";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, SongID, UserID } from "@oly_op/musicloud-common/build/types";

import { Song, Play, Genre, Artist, PlaylistSong, GetObjectsOptions } from "../types";

import {
	getKey,
	getAlbum,
	getObjectInLibrary,
	getObjectDateAddedToLibrary,
	timeStampToMilliseconds,
} from "./helpers";

import {
	SELECT_SONG_PLAYS,
	SELECT_SONG_GENRES,
	SELECT_SONG_ARTISTS,
	SELECT_SONG_REMIXERS,
	SELECT_PLAYLIST_SONG,
	SELECT_SONG_FEATURING,
	SELECT_OBJECT_SONG_PLAYS,
} from "../sql";

import createParentResolver from "./create-parent-resolver";

const resolver = createParentResolver<Song>();

export const size = resolver(async ({ parent, context }) => {
	const songID = removeDashesFromUUID(parent.songID);
	const Key = `catalog/${songID}/audio/index.mp3`;
	const command = new GetObjectCommand({ Bucket: NAME, Key });
	const content = await context.s3.send(command);
	return content.ContentLength!;
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
			columnNames: join(COLUMN_NAMES.GENRE, "genres"),
		},
	}),
);

export const artists = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_ARTISTS)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const remixers = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_REMIXERS)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const featuring = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_FEATURING)({
		parse: convertTableToCamelCase<Artist>(),
		variables: {
			songID: parent.songID,
			columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
		},
	}),
);

export const playsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_SONG_PLAYS)({
		parse: getResultRowCountOrNull,
		variables: {
			songID: parent.songID,
			columnNames: join(COLUMN_NAMES.PLAY),
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
		columnNames: join(COLUMN_NAMES.PLAY),
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
