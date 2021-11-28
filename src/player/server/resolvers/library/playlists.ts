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
import { Playlist, GetObjectsOptions, LibraryObjectsPaginatedArgs } from "../../types"
import { SELECT_LIBRARY_PLAYLISTS, SELECT_LIBRARY_PLAYLISTS_PAGINATED } from "../../sql"

interface GetLibraryPlaylistsOptions<T>
	extends UserIDBase, GetObjectsOptions<T> {}

const getLibraryPlaylists =
	(client: PoolOrClient) =>
		<T>({ userID, columnNames, parse }: GetLibraryPlaylistsOptions<T>) =>
			query(client)(SELECT_LIBRARY_PLAYLISTS)({
				parse,
				variables: {
					userID,
					columnNames,
				},
			})

export const playlists =
	resolver(
		({ context }) => (
			getLibraryPlaylists(context.pg)({
				userID: context.authorization!.userID,
				parse: convertTableToCamelCaseOrNull<Playlist>(),
				columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
			})
		),
	)

export const playlistsTotal =
	resolver(
		({ context }) => (
			getLibraryPlaylists(context.pg)({
				parse: getResultRowCountOrNull,
				userID: context.authorization!.userID,
				columnNames: `playlists.${COLUMN_NAMES.PLAYLIST[0]}`,
			})
		),
	)

export const playlistsPaginated =
	resolver<Playlist[] | null, LibraryObjectsPaginatedArgs>(
		({ context, args }) => (
			query(context.pg)(SELECT_LIBRARY_PLAYLISTS_PAGINATED)({
				parse: convertTableToCamelCaseOrNull(),
				variables: {
					page: args.input.page,
					userID: context.authorization!.userID,
					orderByField: args.input.orderBy.field,
					paginationPageSize: PAGINATION_PAGE_SIZE,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
					orderByTableName:
						args.input.orderBy.field === "DATE_ADDED" ?
							"library_playlists" : "playlists",
				},
			})
		),
	)