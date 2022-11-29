import { PlaylistID, UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient } from "@oly_op/pg-helpers";

import { getPlaylist } from "./get-objects";

export interface IsNotUsersPlaylistOptions extends UserID, PlaylistID {}

export const isNotUsersPlaylist =
	(pg: PoolOrClient) =>
	async ({ userID, playlistID }: IsNotUsersPlaylistOptions) => {
		const playlist = await getPlaylist(pg)({ playlistID });
		return playlist.userID !== userID;
	};
