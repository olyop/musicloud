import {
	join,
	query,
	PoolOrClient,
	convertTableToCamelCase,
	getResultRowCountOrNull,
} from "@oly_op/pg-helpers"

import {
	Song,
	Play,
	Genre,
	OrderByArgs,
	GetObjectsOptions,
} from "../types"

import { COLUMN_NAMES } from "../globals"
import { SELECT_GENRE_SONGS, SELECT_OBJECT_SONG_PLAYS } from "../sql"
import { createResolver, determineSongsSQLOrderByField } from "./helpers"

const resolver =
	createResolver<Genre>()

const getSongs =
	(client: PoolOrClient) =>
		<T>({ objectID, parse, orderBy }: GetObjectsOptions<T>) =>
			query(client)(SELECT_GENRE_SONGS)({
				parse,
				variables: {
					genreID: objectID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByDirection: orderBy?.direction || "ASC",
					orderByField: determineSongsSQLOrderByField(
						orderBy?.field.toLowerCase() || "title",
					),
				},
			})

const getUserPlays =
	(client: PoolOrClient) =>
		(userID: string) =>
			<T>({ objectID, parse }: GetObjectsOptions<T>) =>
				query(client)(SELECT_OBJECT_SONG_PLAYS)({
					parse,
					variables: {
						userID,
						genreID: objectID,
						columnNames: join(COLUMN_NAMES.PLAY),
					},
				})

export const songs =
	resolver<Song[], OrderByArgs>(
		({ parent, args, context }) => (
			getSongs(context.pg)({
				orderBy: args.orderBy,
				objectID: parent.genreID,
				parse: convertTableToCamelCase(),
			})
		),
	)

export const songsTotal =
	resolver(
		({ parent, context }) => (
			getSongs(context.pg)({
				objectID: parent.genreID,
				parse: getResultRowCountOrNull,
			})
		),
	)

export const userPlays =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.genreID,
				parse: convertTableToCamelCase<Play>(),
			})
		),
	)

export const userPlaysTotal =
	resolver(
		({ parent, context }) => (
			getUserPlays(context.pg)(context.authorization!.userID)({
				objectID: parent.genreID,
				parse: getResultRowCountOrNull,
			})
		),
	)