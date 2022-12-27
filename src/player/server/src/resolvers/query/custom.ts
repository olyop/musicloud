import ms from "ms";

import { Album, Playlist } from "../../types/index.js";
import {
	getPlaysCount,
	getTopSongs,
	getTrendingAlbums as getTrendingAlbumsHelper,
	getTrendingPlaylists as getTrendingPlaylistsHelper,
	redisHandler,
	redisPlaysTotalKey,
	redisTopOneHundredSongsKey,
	redisTopTenSongsKey,
	redisTrendingAlbumsKey,
	redisTrendingPlaylistsKey,
} from "../helpers/index.js";
import resolver from "./resolver.js";

export const getPlaysTotal = resolver(({ context }) =>
	redisHandler(context.redis)(redisPlaysTotalKey, getPlaysCount(context.pg)(), ms("30m")),
);

export const getTopTenSongs = resolver(({ context }) =>
	redisHandler(context.redis)(redisTopOneHundredSongsKey, getTopSongs(context.pg)(10), ms("30m")),
);

export const getTopOneHundredSongs = resolver(({ context }) =>
	redisHandler(context.redis)(redisTopTenSongsKey, getTopSongs(context.pg)(100), ms("30m")),
);

export const getTrendingAlbums = resolver<Album[]>(({ context }) =>
	redisHandler(context.redis)(
		redisTrendingAlbumsKey,
		getTrendingAlbumsHelper(context.pg)(4),
		ms("30m"),
	),
);

export const getTrendingPlaylists = resolver<Playlist[]>(({ context }) =>
	redisHandler(context.redis)(
		redisTrendingPlaylistsKey,
		getTrendingPlaylistsHelper(context.pg)(4),
		ms("30m"),
	),
);
