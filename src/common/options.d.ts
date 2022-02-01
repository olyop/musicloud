import { PoolConfig } from "pg";
import { fastifyHelmet } from "fastify-helmet";
import { FastifyCorsOptions } from "fastify-cors";
export declare const PG_POOL_OPTIONS: PoolConfig;
export declare const HELMET_OPTIONS: Parameters<typeof fastifyHelmet>[1];
export declare const CORS_OPTIONS: FastifyCorsOptions;
export declare const ALGOLIA_OPTIONS: readonly [string, string];
