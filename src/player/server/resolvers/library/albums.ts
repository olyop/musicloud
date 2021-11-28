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
import { SELECT_LIBRARY_ALBUMS, SELECT_LIBRARY_ALBUMS_PAGINATED } from "../../sql"
import { Album, GetObjectsOptions, LibraryObjectsPaginatedArgs } from "../../types"

interface GetLibraryAlbumsOptions<T>
	extends UserIDBase, GetObjectsOptions<T> {}

const getLibraryAlbums =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetLibraryAlbumsOptions<T>) =>
			query(client)(SELECT_LIBRARY_ALBUMS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const albums =
	resolver(
		({ context }) => (
			getLibraryAlbums(context.pg)({
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Album>(),
				columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
			})
		),
	)

export const albumsTotal =
	resolver(
		({ context }) => (
			getLibraryAlbums(context.pg)({
				parse: getResultRowCountOrNull,
				userID: context.authorization!.userID,
				columnNames: `albums.${COLUMN_NAMES.ALBUM[0]}`,
			})
		),
	)

export const albumsPaginated =
	resolver<Album[] | null, LibraryObjectsPaginatedArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_ALBUMS_PAGINATED)({
				parse: convertTableToCamelCaseOrNull(),
				variables: {
					page: args.input.page,
					userID: context.authorization!.userID,
					paginationPageSize: PAGINATION_PAGE_SIZE,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.ALBUM, "albums"),
					orderByField: args.input.orderBy.field.toLowerCase(),
				},
			})
		),
	)