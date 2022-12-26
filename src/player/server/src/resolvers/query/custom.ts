import ms from "ms";

import { Album, Playlist } from "../../types/index.js";
import {
	getPlaysCount,
	getTopSongs,
	getTrendingAlbums as getTrendingAlbumsHelper,
	getTrendingPlaylists as getTrendingPlaylistsHelper,
	redisHandler,
} from "../helpers/index.js";
import resolver from "./resolver.js";

export const getPlaysTotal = resolver(({ context }) =>
	redisHandler(context.redis)("plays-total", () => getPlaysCount(context.pg)(), ms("30m")),
);

export const getTopTenSongs = resolver(({ context }) =>
	redisHandler(context.redis)("top10", () => getTopSongs(context.pg)(10), ms("30m")),
);

export const getTopOneHundredSongs = resolver(({ context }) =>
	redisHandler(context.redis)("top100", () => getTopSongs(context.pg)(100), ms("30m")),
);

export const getTrendingAlbums = resolver<Album[]>(({ context }) =>
	redisHandler(context.redis)(
		"trending-albums",
		() => getTrendingAlbumsHelper(context.pg)(4),
		ms("30m"),
	),
);

export const getTrendingPlaylists = resolver<Playlist[]>(({ context }) =>
	redisHandler(context.redis)(
		"trending-playlists",
		() => getTrendingPlaylistsHelper(context.pg)(4),
		ms("30m"),
	),
);
