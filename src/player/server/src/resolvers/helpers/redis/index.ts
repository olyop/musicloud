import { Redis } from "ioredis";
import { isNull } from "lodash-es";
import ms from "ms";

export {
	determineRedisAlbumsKey,
	determineRedisArtistsKey,
	determineRedisGenresKey,
	determineRedisKeysKey,
	determineRedisPlaylistsKey,
	determineRedisPlaysKey,
	determineRedisSongsKey,
	determineRedisUsersKey,
	redisPlaysTotalKey,
	redisTopOneHundredSongsKey,
	redisTopTenSongsKey,
	redisTrendingAlbumsKey,
	redisTrendingPlaylistsKey,
} from "./keys.js";

export const existsCacheValue = (redis?: Redis) => async (key: string) => {
	if (redis) {
		return (await redis.exists(key)) === 1;
	} else {
		return false;
	}
};

export const getCacheValue =
	(redis?: Redis) =>
	async <T>(key: string) => {
		if (redis) {
			const value = await redis.get(key);
			if (isNull(value)) {
				return null;
			} else {
				const json = JSON.parse(value) as T;
				return json;
			}
		} else {
			return null;
		}
	};

export const setCacheValue =
	(redis?: Redis) =>
	async <T = unknown>(key: string, value: T, expires?: number) => {
		if (redis && !isNull(value)) {
			const keyExists = await existsCacheValue(redis)(key);
			if (keyExists && expires) {
				await redis.set(key, JSON.stringify(value), "PX", expires || ms("7d"));
			} else {
				await redis.set(key, JSON.stringify(value));
			}
		}
	};

export const deleteCacheValue = (redis?: Redis) => async (key: string) => {
	if (redis) {
		await redis.del(key);
	}
};

export const getCacheValueOrExists =
	(redis?: Redis) =>
	async <T>(key: string) => {
		const value = await getCacheValue(redis)<T>(key);
		if (isNull(value)) {
			return false;
		} else {
			return value;
		}
	};

export const redisHandler =
	(redis?: Redis) =>
	async <T>(key: string, databaseQuery: () => Promise<T>, expires?: number) => {
		const cacheValue = await getCacheValueOrExists(redis)<T>(key);
		if (cacheValue === false) {
			console.log(`cache-miss: ${key}`);
			const databaseValue = await databaseQuery();
			await setCacheValue(redis)(key, databaseValue, expires);
			return databaseValue;
		} else {
			return cacheValue;
		}
	};
