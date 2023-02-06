import fastifyApollo from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyPostgres from "@fastify/postgres";
import fastifyRedis from "@fastify/redis";
import serveStatic from "@fastify/static";
import { serveClient } from "@oly_op/musicloud-common/build/serve-client";
import {
	FASTIFY_HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/musicloud-common/build/server-options";

import { context } from "./context/index.js";
import { healthCheck } from "./health-check.js";
import {
	FASTIFY_CORS_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
	FASTIFY_REDIS_OPTIONS,
	FASTIFY_SERVE_CLIENT_OPTIONS,
	FASTIFY_STATIC_OPTIONS,
} from "./options.js";
import { apollo, fastify } from "./services.js";

await apollo.start();

await fastify.register(compress);
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS);
await fastify.register(cors, FASTIFY_CORS_OPTIONS);
await fastify.register(serveStatic, FASTIFY_STATIC_OPTIONS);
await fastify.register(fastifyPostgres, PG_POOL_OPTIONS);
await fastify.register(fastifyRedis, FASTIFY_REDIS_OPTIONS);
await fastify.register(fastifyApollo(apollo), { context });
await fastify.register(healthCheck);
await fastify.register(serveClient, FASTIFY_SERVE_CLIENT_OPTIONS);

await fastify.listen(FASTIFY_LISTEN_OPTIONS);
