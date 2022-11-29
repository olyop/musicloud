import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, PlaylistPrivacy, UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCaseOrNull,
	getResultCountOrNull,
	getResultRowCountOrNull,
	getResultSumOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { random } from "lodash-es";

import { SELECT_OBJECT_SONG_PLAYS } from "../../sql";
import { GetObjectsOptions, Play, Playlist, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import {
	getObjectDateAddedToLibrary,
	getObjectInLibrary,
	getUser,
	timeStampToMilliseconds,
} from "../helpers";

const isf = importSQL(import.meta.url);

const SELECT_PLAYLIST_SONGS = await isf("select-songs");
const SELECT_PLAYLIST_SONGS_COUNT = await isf("select-songs-count");
const SELECT_PLAYLIST_SONGS_DURATION_SUM = await isf("select-songs-duration-sum");

const resolver = createParentResolver<Playlist>(({ parent, context }) => {
	if (
		parent.privacy === PlaylistPrivacy.PRIVATE &&
		parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID
	) {
		throw new Error("Unauthorized access to this playlist");
	}
});

export const privacy = resolver(({ parent }) => Promise.resolve(parent.privacy));

export const dateCreated = resolver(({ parent }) =>
	Promise.resolve(timeStampToMilliseconds(parent.dateCreated)),
);

export const user = resolver(({ parent, context }) =>
	getUser(context.pg)({ userID: parent.userID }),
);

export const playsTotal = resolver(() => Promise.resolve(random(50, 1000)));

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

export const duration = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_PLAYLIST_SONGS_DURATION_SUM)({
		parse: getResultSumOrNull,
		variables: {
			playlistID: parent.playlistID,
		},
	}),
);

interface GetUserPlaylistPlaysOptions<T> extends UserID, PlaylistID, GetObjectsOptions<T> {}

const getUserPlaylistPlays =
	(client: PoolOrClient) =>
	<T>({ userID, playlistID, columnNames, parse }: GetUserPlaylistPlaysOptions<T>) =>
		query(client)(SELECT_OBJECT_SONG_PLAYS)({
			parse,
			variables: {
				userID,
				playlistID,
				columnNames,
			},
		});

export const userPlays = resolver(({ parent, context }) =>
	getUserPlaylistPlays(context.pg)({
		playlistID: parent.playlistID,
		columnNames: addPrefix(COLUMN_NAMES.PLAY),
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		parse: convertTableToCamelCaseOrNull<Play>(),
	}),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	getUserPlaylistPlays(context.pg)({
		playlistID: parent.playlistID,
		parse: getResultRowCountOrNull,
		columnNames: COLUMN_NAMES.PLAY[0],
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
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
