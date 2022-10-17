import {
	join,
	query,
	getResultRowCountOrNull,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers";

import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";

import resolver from "./resolver";
import { Playlist, LibraryObjectAtIndexArgs } from "../../types";
import { SELECT_LIBRARY_PLAYLISTS, SELECT_LIBRARY_PLAYLIST_AT_INDEX } from "../../sql";

export const playlistsTotal = resolver(({ context }) =>
	query(context.pg)(SELECT_LIBRARY_PLAYLISTS)({
		parse: getResultRowCountOrNull,
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
			columnNames: `playlists.${COLUMN_NAMES.PLAYLIST[0]}`,
		},
	}),
);

export const playlistAtIndex = resolver<Playlist | null, LibraryObjectAtIndexArgs>(
	({ args, context }) =>
		query(context.pg)(SELECT_LIBRARY_PLAYLIST_AT_INDEX)({
			parse: convertFirstRowToCamelCaseOrNull(),
			variables: {
				atIndex: args.input.atIndex,
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
				orderByDirection: args.input.orderBy.direction,
				columnNames: join(COLUMN_NAMES.PLAYLIST, "playlists"),
				orderByField: `${
					args.input.orderBy.field === "DATE_ADDED" ? "library_playlists" : "playlists"
				}.${args.input.orderBy.field}`,
			},
		}),
);
