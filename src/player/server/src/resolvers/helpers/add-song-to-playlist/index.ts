import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";
import { GraphQLError } from "graphql";

import { IndexOptions } from "../../../types";
import { isSongInPlaylist } from "../is-song-in-playlist";

const INSERT_PLAYLIST_SONG = await importSQL(import.meta.url)("insert-playlist-song");

interface Options extends SongID, PlaylistID, IndexOptions {}

export const addSongToPlaylist = (pg: PoolOrClient) => async (options: Options) => {
	const { index, songID, playlistID } = options;

	const isInPlaylist = await isSongInPlaylist(pg)({ songID, playlistID });

	if (isInPlaylist) {
		throw new GraphQLError("Song already in playlist");
	} else {
		await query(pg)(INSERT_PLAYLIST_SONG)({
			variables: {
				index,
				songID,
				playlistID,
			},
		});
	}
};
