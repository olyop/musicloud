import {
	join,
	query,
	PoolOrClient,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { UserID, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_LIBRARY_GENRES, SELECT_LIBRARY_GENRES_PAGINATED } from "../../sql"
import { Genre, GetObjectsOptions, LibraryObjectsPaginatedArgs } from "../../types"

interface GetLibraryGenres<T>
	extends UserID, GetObjectsOptions<T> {}

const getLibraryGenres =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetLibraryGenres<T>) =>
			query(client)(SELECT_LIBRARY_GENRES)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const genres =
	resolver(
		({ context }) => (
			getLibraryGenres(context.pg)({
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Genre>(),
				columnNames: join(COLUMN_NAMES.GENRE, "genres"),
			})
		),
	)

export const genresTotal =
	resolver(
		({ context }) => (
			getLibraryGenres(context.pg)({
				parse: getResultRowCountOrNull,
				userID: context.authorization!.userID,
				columnNames: `genres.${COLUMN_NAMES.GENRE[0]}`,
			})
		),
	)

export const genresPaginated =
	resolver<Genre[] | null, LibraryObjectsPaginatedArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_GENRES_PAGINATED)({
				parse: convertTableToCamelCaseOrNull(),
				variables: {
					page: args.input.page,
					userID: context.authorization!.userID,
					paginationPageSize: PAGINATION_PAGE_SIZE,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.GENRE, "genres"),
					orderByField: args.input.orderBy.field.toLowerCase(),
				},
			})
		),
	)