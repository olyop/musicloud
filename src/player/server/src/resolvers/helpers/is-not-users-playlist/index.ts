import { PlaylistID, UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, convertFirstRowToCamelCase, importSQL, query } from "@oly_op/pg-helpers";

const SELECT_PLAYLIST_USER_ID = await importSQL(import.meta.url)("select-playlist-user-id");

export const isNotUsersPlaylist =
	(pg: PoolOrClient) =>
	async ({ userID, playlistID }: IsNotUsersPlaylistOptions) => {
		const playlist = await query(pg)(SELECT_PLAYLIST_USER_ID)({
			parse: convertFirstRowToCamelCase<UserID>(),
			variables: { playlistID },
		});
		return playlist.userID !== userID;
	};

export interface IsNotUsersPlaylistOptions extends UserID, PlaylistID {}
