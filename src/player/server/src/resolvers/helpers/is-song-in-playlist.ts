import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { getResultExists, PoolOrClient, query } from "@oly_op/pg-helpers/build";

import { EXISTS_PLAYLIST_SONG } from "../../sql";

interface Options extends SongID, PlaylistID {}

export const isSongInPlaylist =
	(pg: PoolOrClient) =>
	async ({ songID, playlistID }: Options) =>
		query(pg)(EXISTS_PLAYLIST_SONG)({
			parse: getResultExists,
			variables: { songID, playlistID },
		});
