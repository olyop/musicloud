import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { GenreID, UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	addPrefix,
	convertTableToCamelCase,
	convertTableToCamelCaseOrNull,
	getResultCount,
	getResultRowCountOrNull,
	importSQL,
	addPrefix,
	query,
} from "@oly_op/pg-helpers";

import { SELECT_OBJECT_SONG_PLAYS } from "../../sql";
import { Genre, GetObjectsOptions, OrderByArgs, Play, Song } from "../../types";
import createParentResolver from "../create-parent-resolver";
import { determineSongsSQLOrderByField } from "../helpers";

const isf = importSQL(import.meta.url);

const SELECT_GENRE_SONGS_COUNT = await isf("select-genre-songs-count");
const SELECT_GENRE_SONGS_ORDERED = await isf("select-genre-songs-ordered");

const resolver = createParentResolver<Genre>();

export const songs = resolver<Song[], OrderByArgs>(({ parent, args, context }) =>
	query(context.pg)(SELECT_GENRE_SONGS_ORDERED)({
		parse: convertTableToCamelCase(),
		variables: {
			genreID: parent.genreID,
			orderByDirection: [args.orderBy.direction],
			columnNames: addPrefix(COLUMN_NAMES.SONG, "songs"),
			orderByField: [determineSongsSQLOrderByField(args.orderBy.field)],
		},
	}),
);

export const songsTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_GENRE_SONGS_COUNT)({
		parse: getResultCount,
		variables: {
			genreID: parent.genreID,
			columnNames: [COLUMN_NAMES.SONG[0]],
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
		columnNames: addPrefix(COLUMN_NAMES.GENRE),
		parse: convertTableToCamelCaseOrNull<Play>(),
	}),
);

export const userPlaysTotal = resolver(({ parent, context }) =>
	getUserGenrePlays(context.pg)({
		genreID: parent.genreID,
		parse: getResultRowCountOrNull,
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		columnNames: addPrefix(COLUMN_NAMES.GENRE),
	}),
);
