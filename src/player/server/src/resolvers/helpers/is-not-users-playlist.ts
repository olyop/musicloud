import { pipe } from "rxjs";
import { PlaylistID, UserID } from "@oly_op/musicloud-common/build/types";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { query, PoolOrClient, convertFirstRowToCamelCase } from "@oly_op/pg-helpers";

import { Playlist } from "../../types";
import { SELECT_PLAYLIST_BY_ID } from "../../sql";

export interface IsNotUsersPlaylistOptions extends UserID, PlaylistID {}

export const isNotUsersPlaylist =
	(pg: PoolOrClient) =>
	({ userID, playlistID }: IsNotUsersPlaylistOptions) =>
		query(pg)(SELECT_PLAYLIST_BY_ID)({
			parse: pipe(convertFirstRowToCamelCase<Playlist>(), playlist => playlist.userID !== userID),
			variables: {
				playlistID,
				columnNames: COLUMN_NAMES.USER[0],
			},
		});
