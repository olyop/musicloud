import { isNull } from "lodash-es";

import { RedisClient } from "../../../types";

const KEY_PREFIX = process.env.REDIS_KEY_PREFIX;

const getGlobalRedisKey = (key: string) => `${KEY_PREFIX}:${key}`;

const determineRedisObjectKey = (typeName: string) => (id: string, key: string) =>
	`${typeName}:${id}:${key}`;

export const determineRedisKeysKey = determineRedisObjectKey("keys");
export const determineRedisUsersKey = determineRedisObjectKey("users");
export const determineRedisPlaysKey = determineRedisObjectKey("plays");
export const determineRedisSongsKey = determineRedisObjectKey("songs");
export const determineRedisAlbumsKey = determineRedisObjectKey("albums");
export const determineRedisGenresKey = determineRedisObjectKey("genres");
export const determineRedisArtistsKey = determineRedisObjectKey("artists");
export const determineRedisPlaylistsKey = determineRedisObjectKey("playlists");

export const existsCacheValue = (redis?: RedisClient) => async (key: string) => {
	if (redis) {
		return (await redis.exists(getGlobalRedisKey(key))) === 1;
	} else {
		return false;
	}
};

export const getCacheValue =
	(redis?: RedisClient) =>
	async <T>(key: string) => {
		if (redis) {
			const value = await redis.get(getGlobalRedisKey(key));
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
	(redis?: RedisClient) => async (key: string, value: unknown, expires?: number) => {
		if (redis) {
			const keyExists = await existsCacheValue(redis)(key);
			if (!keyExists) {
				await redis.set(getGlobalRedisKey(key), JSON.stringify(value), {
					EX: expires ? Math.floor(expires / 1000) : undefined,
				});
			}
		}
	};

export const deleteCacheValue = (redis?: RedisClient) => async (key: string) => {
	if (redis) {
		await redis.del(getGlobalRedisKey(key));
	}
};

const isPromise = <T>(promise: unknown): promise is Promise<T> =>
	// @ts-ignore
	!!promise && "then" in promise && typeof promise.then === "function";

export const getCacheValueOrExists =
	(redis?: RedisClient) =>
	async <T>(key: string) => {
		const value = await getCacheValue(redis)<T>(key);
		if (isNull(value)) {
			return false;
		} else {
			return value;
		}
	};

export const redisHandler =
	(redis?: RedisClient) =>
	async <T>(key: string, databaseQuery: Promise<T> | (() => Promise<T>), expires?: number) => {
		const value = await getCacheValueOrExists(redis)<T>(key);
		if (value === false) {
			const databaseValue = await (isPromise(databaseQuery) ? databaseQuery : databaseQuery());
			await setCacheValue(redis)(key, databaseValue, expires);
			return databaseValue;
		} else {
			return value;
		}
	};
