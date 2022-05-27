import {
	join,
	query,
	PoolOrClient,
	getResultRowCountOrNull,
	convertTableToCamelCaseOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { UserID, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import {
	SELECT_LIBRARY_PLAYLISTS,
	SELECT_LIBRARY_PLAYLISTS_PAGINATED,
	SELECT_LIBRARY_PLAYLIST_AT_INDEX,
} from "../../sql"

import resolver from "./resolver"
import { COLUMN_NAMES } from "../../globals"
import { Playlist, GetObjectsOptions, LibraryObjectsPaginatedArgs, LibraryObjectAtIndexArgs } from "../../types"

interface GetLibraryPlaylistsOptions<T>
	extends UserID, GetObjectsOptions<T> {}

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

export const playlistAtIndex =
	resolver<Playlist | null, LibraryObjectAtIndexArgs>(
		({ args, context }) => (
			query(context.pg)(SELECT_LIBRARY_PLAYLIST_AT_INDEX)({
				parse: convertFirstRowToCamelCaseOrNull(),
				variables: {
					atIndex: args.input.atIndex,
					userID: context.authorization!.userID,
					orderByDirection: args.input.orderBy.direction,
					columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
					orderByField: `playlists.${args.input.orderBy.field}`,
				},
			})
		),
	)