import { RedisClusterType, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";

export interface OrderBy {
	field: string;
	direction: string;
}

export type RedisClient = RedisClusterType<RedisModules, RedisFunctions, RedisScripts>;
