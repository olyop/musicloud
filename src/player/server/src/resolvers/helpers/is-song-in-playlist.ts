import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { getResultExists, query } from "@oly_op/pg-helpers/build";

import { EXISTS_PLAYLIST_SONG } from "../../sql";
import { Database } from "../../types";

export const isSongInPlaylist =
	(pg: Database) =>
	async ({ songID, playlistID }: Options) => {
		const result = await pg.result(EXISTS_PLAYLIST_SONG, { songID, playlistID });
		result.command;
	};

interface Options extends SongID, PlaylistID {}
