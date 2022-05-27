import {
	join,
	query,
	PoolOrClient,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { UserID, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { determineSongsSQLOrderByField } from "../helpers"
import { Song, GetObjectsOptions, LibraryObjectsPaginatedArgs, LibraryObjectAtIndexArgs } from "../../types"
import { SELECT_LIBRARY_SONGS, SELECT_LIBRARY_SONGS_PAGINATED, SELECT_LIBRARY_SONG_AT_INDEX } from "../../sql"

interface GetLibrarySongsInput<T>
	extends UserID, GetObjectsOptions<T> {}

const getLibrarySongs =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetLibrarySongsInput<T>) =>
			query(client)(SELECT_LIBRARY_SONGS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const songs =
	resolver(
		({ context }) => (
			getLibrarySongs(context.pg)({
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Song>(),
				columnNames: join(COLUMN_NAMES.SONG, "songs"),
			})
		),
	)

export const songsTotal =
	resolver(
		({ context }) => (
			getLibrarySongs(context.pg)({
				parse: getResultRowCountOrNull,
				userID: context.authorization!.userID,
				columnNames: `songs.${COLUMN_NAMES.SONG[0]}`,
			})
		),
	)

export const songsPaginated =
	resolver<Song[] | null, LibraryObjectsPaginatedArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_SONGS_PAGINATED)({
				parse: convertTableToCamelCaseOrNull(),
				variables: {
					page: args.input.page,
					userID: context.authorization!.userID,
					paginationPageSize: PAGINATION_PAGE_SIZE,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByDirection: args.input.orderBy.direction,
					orderByField: determineSongsSQLOrderByField(args.input.orderBy.field),
				},
			})
		),
	)

export const songAtIndex =
	resolver<Song | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_SONG_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					userID: context.authorization!.userID,
					columnNames: join(COLUMN_NAMES.SONG, "songs"),
					orderByDirection: args.input.orderBy.direction,
					orderByField: determineSongsSQLOrderByField(args.input.orderBy.field),
				},
			})
		),
	)