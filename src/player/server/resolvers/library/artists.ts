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
import { Artist, GetObjectsOptions, LibraryObjectsPaginatedArgs } from "../../types"
import { SELECT_LIBRARY_ARTISTS, SELECT_LIBRARY_ARTISTS_PAGINATED } from "../../sql"

interface GetLibraryArtistsOptions<T>
	extends UserIDBase, GetObjectsOptions<T> {}

const getLibraryArtists =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetLibraryArtistsOptions<T>) =>
			query(client)(SELECT_LIBRARY_ARTISTS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const artists =
	resolver(
		({ context }) => (
			getLibraryArtists(context.pg)({
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Artist>(),
				columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
			})
		),
	)

export const artistsTotal =
	resolver(
		({ context }) => (
			getLibraryArtists(context.pg)({
				parse: getResultRowCountOrNull,
				userID: context.authorization!.userID,
				columnNames: `artists.${COLUMN_NAMES.ARTIST[0]}`,
			})
		),
	)

export const artistsPaginated =
	resolver<Artist[] | null, LibraryObjectsPaginatedArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_ARTISTS_PAGINATED)({
				parse: convertTableToCamelCaseOrNull(),
				variables: {
					page: args.input.page,
					userID: context.authorization!.userID,
					paginationPageSize: PAGINATION_PAGE_SIZE,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.ARTIST, "artists"),
					orderByField: args.input.orderBy.field.toLowerCase(),
					orderByTableName:
						args.input.orderBy.field === "DATE_ADDED" ?
							"library_artists" : "artists",
				},
			})
		),
	)