import { PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, getResultExists, importSQL, query } from "@oly_op/pg-helpers";

const EXISTS_PLAYLIST_SONG = await importSQL(import.meta.url)("execute-is-song-in-playlist");

interface Options extends SongID, PlaylistID {}

export const isSongInPlaylist =
	(pg: PoolOrClient) =>
	async ({ songID, playlistID }: Options) =>
		query(pg)(EXISTS_PLAYLIST_SONG)({
			parse: getResultExists,
			variables: { songID, playlistID },
		});
