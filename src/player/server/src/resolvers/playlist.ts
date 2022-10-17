import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers";

import { pipe } from "rxjs";
import { random } from "lodash-es";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { PlaylistID, PlaylistPrivacy, UserID } from "@oly_op/musicloud-common/build/types";

import {
	getUser,
	getObjectInLibrary,
	getSongsDurationOrNull,
	getObjectDateAddedToLibrary,
	timeStampToMilliseconds,
} from "./helpers";

import createParentResolver from "./create-parent-resolver";
import { Song, Play, Playlist, GetObjectsOptions } from "../types";
import { SELECT_PLAYLIST_SONGS, SELECT_OBJECT_SONG_PLAYS } from "../sql";

const resolver = createParentResolver<Playlist>(({ parent, context }) => {
	if (
		parent.privacy === PlaylistPrivacy.PRIVATE &&
		parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID
	) {
		throw new Error("Unauthorized access to this playlist");
	}
});

export const privacy = resolver(({ parent }) => Promise.resolve(parent.privacy.toUpperCase()));

export const dateCreated = resolver(({ parent }) =>
	Promise.resolve(timeStampToMilliseconds(parent.dateCreated)),
);

export const user = resolver(({ parent, context }) =>
	getUser(context.pg)({ userID: parent.userID }),
);

export const playsTotal = resolver(() => Promise.resolve(random(50, 1000)));

interface GetPlaylistSongsOptions<T> extends PlaylistID, GetObjectsOptions<T> {}

const getPlaylistSongs =
	(pg: PoolOrClient) =>
	<T>({ playlistID, columnNames, parse }: GetPlaylistSongsOptions<T>) =>
		query(pg)(SELECT_PLAYLIST_SONGS)({
			parse,
			variables: {
				playlistID,
				columnNames,
			},
		});

export const songs = resolver(({ parent, context }) =>
	getPlaylistSongs(context.pg)({
		playlistID: parent.playlistID,
		parse: convertTableToCamelCaseOrNull<Song>(),
		columnNames: join(COLUMN_NAMES.SONG, "songs"),
	}),
);

export const songsTotal = resolver(({ parent, context }) =>
	getPlaylistSongs(context.pg)({
		playlistID: parent.playlistID,
		parse: getResultRowCountOrNull,
		columnNames: `songs.${COLUMN_NAMES.SONG[0]}`,
	}),
);

export const duration = resolver(({ parent, context }) =>
	getPlaylistSongs(context.pg)({
		playlistID: parent.playlistID,
		columnNames: "songs.duration",
		parse: pipe(convertTableToCamelCase<Song>(), getSongsDurationOrNull),
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
		columnNames: join(COLUMN_NAMES.PLAY),
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
