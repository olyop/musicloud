import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";

export interface OrderBy {
	field: string;
	direction: string;
}

export type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
