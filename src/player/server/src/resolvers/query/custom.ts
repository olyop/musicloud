import { Album, Playlist } from "../../types";
import {
	getPlaysCount,
	getTopSongs,
	getTrendingAlbums as getTrendingAlbumsHelper,
	getTrendingPlaylists as getTrendingPlaylistsHelper,
} from "../helpers";
import resolver from "./resolver";

export const getPlaysTotal = resolver(({ context }) => getPlaysCount(context.pg)());

export const getTopTenSongs = resolver(({ context }) => getTopSongs(context.pg)(10));

export const getTopOneHundredSongs = resolver(({ context }) => getTopSongs(context.pg)(100));

export const getTrendingAlbums = resolver<Album[]>(({ context }) =>
	getTrendingAlbumsHelper(context.pg)(4),
);

export const getTrendingPlaylists = resolver<Playlist[]>(({ context }) =>
	getTrendingPlaylistsHelper(context.pg)(4),
);
