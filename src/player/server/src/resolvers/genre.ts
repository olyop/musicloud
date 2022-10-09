import { GenreID, UserID } from "@oly_op/musicloud-common/build/types";

import {
	join,
	query,
	PoolOrClient,
	getResultRowCount,
	getResultRowCountOrNull,
	convertTableToCamelCase,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers";

import { Song, Play, Genre, OrderByArgs, GetObjectsOptions } from "../types";

import { SELECT_GENRE_SONGS, SELECT_OBJECT_SONG_PLAYS, SELECT_GENRE_SONGS_ORDER_BY } from "../sql";

import { COLUMN_NAMES } from "../globals";
import { determineSongsSQLOrderByField } from "./helpers";
import createParentResolver from "./create-parent-resolver";

const resolver = createParentResolver<Genre>();

export const songs = resolver<Song[], OrderByArgs>(({ parent, args, context }) =>
	query(context.pg)(SELECT_GENRE_SONGS_ORDER_BY)({
		parse: convertTableToCamelCase(),
		variables: {
			genreID: parent.genreID,
			orderByDirection: args.orderBy.direction,
			columnNames: join(COLUMN_NAMES.SONG, "songs"),
			orderByField: determineSongsSQLOrderByField(args.orderBy.field),
		},
	}),
);

export const songsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_GENRE_SONGS)({
		parse: getResultRowCount,
		variables: {
			genreID: parent.genreID,
			columnNames: COLUMN_NAMES.SONG[0],
		},
	}),
);

interface GetUserGenrePlays<T> extends UserID, GenreID, GetObjectsOptions<T> {}

const getUserGenrePlays =
	(client: PoolOrClient) =>
	<T>({ userID, genreID, columnNames, parse }: GetUserGenrePlays<T>) =>
		query(client)(SELECT_OBJECT_SONG_PLAYS)({
			parse,
			variables: {
				userID,
				genreID,
				columnNames,
			},
		});

export const userPlays = resolver(({ parent, context }) =>
	getUserGenrePlays(context.pg)({
		genreID: parent.genreID,
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		columnNames: join(COLUMN_NAMES.GENRE),
		parse: convertTableToCamelCaseOrNull<Play>(),
	}),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	getUserGenrePlays(context.pg)({
		genreID: parent.genreID,
		parse: getResultRowCountOrNull,
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		columnNames: join(COLUMN_NAMES.GENRE),
	}),
);
