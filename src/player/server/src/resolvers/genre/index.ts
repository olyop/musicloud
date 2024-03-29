import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	addPrefix,
	convertTableToCamelCase,
	getResultCount,
	getResultCountOrNull,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import ms from "ms";

import { Genre, OrderByArgs, Song } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";
import {
	determineRedisGenresKey,
	determineSongsSQLOrderByField,
	redisHandler,
} from "../helpers/index.js";

const isf = importSQL(import.meta.url);

const SELECT_GENRE_PLAYS_COUNT = await isf("select-plays-count");
const SELECT_GENRE_SONGS_COUNT = await isf("select-songs-count");
const SELECT_GENRE_SONGS_ORDERED = await isf("select-songs-ordered");
const SELECT_GENRE_USER_PLAYS_COUNT = await isf("select-user-plays-count");

const resolver = createParentResolver<Genre>();

export const songsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(determineRedisGenresKey(parent.genreID, "songs-total"), () =>
		query(context.pg)(SELECT_GENRE_SONGS_COUNT)({
			parse: getResultCount,
			variables: {
				genreID: parent.genreID,
				columnNames: [COLUMN_NAMES.SONG[0]],
			},
		}),
	),
);

export const playsTotal = resolver(({ parent, context }) =>
	redisHandler(context.redis)(
		determineRedisGenresKey(parent.genreID, "plays-total"),
		() =>
			query(context.pg)(SELECT_GENRE_PLAYS_COUNT)({
				parse: getResultCountOrNull,
				variables: {
					genreID: parent.genreID,
				},
			}),
		ms("30m"),
	),
);

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

export const userPlaysTotal = resolver(({ parent, context }) =>
	query(context.pg)(SELECT_GENRE_USER_PLAYS_COUNT)({
		parse: getResultCountOrNull,
		variables: {
			genreID: parent.genreID,
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);
