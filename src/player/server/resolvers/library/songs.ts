import {
	join,
	query,
	PoolOrClient,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { UserIDBase } from "@oly_op/music-app-common/types"
import { PAGINATION_PAGE_SIZE } from "@oly_op/music-app-common/globals"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { determineSongsSQLOrderByField } from "../helpers"
import { SELECT_LIBRARY_SONGS, SELECT_LIBRARY_SONGS_PAGINATED } from "../../sql"
import { Song, GetObjectsOptions, LibraryObjectsPaginatedArgs } from "../../types"

interface GetLibrarySongsInput<T>
	extends UserIDBase, GetObjectsOptions<T> {}

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
				columnNames: COLUMN_NAMES.SONG[0],
				userID: context.authorization!.userID,
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