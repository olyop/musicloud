const KEY_PREFIX = process.env.REDIS_KEY_PREFIX;

const determineRedisKey = (key: string) => `${KEY_PREFIX}:${key}`;

export const redisPlaysTotalKey = determineRedisKey("plays-total");
export const redisTopTenSongsKey = determineRedisKey("top10");
export const redisTopOneHundredSongsKey = determineRedisKey("top100");
export const redisTrendingAlbumsKey = determineRedisKey("trending-albums");
export const redisTrendingPlaylistsKey = determineRedisKey("trending-playlists");

const determineRedisObjectKey = (typeName: string) => (id: string, key: string) =>
	determineRedisKey(`${typeName}:${id}:${key}`);

export const determineRedisKeysKey = determineRedisObjectKey("keys");
export const determineRedisUsersKey = determineRedisObjectKey("users");
export const determineRedisPlaysKey = determineRedisObjectKey("plays");
export const determineRedisSongsKey = determineRedisObjectKey("songs");
export const determineRedisAlbumsKey = determineRedisObjectKey("albums");
export const determineRedisGenresKey = determineRedisObjectKey("genres");
export const determineRedisArtistsKey = determineRedisObjectKey("artists");
export const determineRedisPlaylistsKey = determineRedisObjectKey("playlists");
