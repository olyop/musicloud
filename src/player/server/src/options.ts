import { ApolloServerOptions } from "@apollo/server";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { FastifyRedisPluginOptions } from "@fastify/redis";
import {
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common/build/create-server-options";
import { FastifyServeClientOptions } from "@oly_op/musicloud-common/build/serve-client";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { FastifyListenOptions } from "fastify";

import { Context } from "./context/index.js";
import resolvers from "./resolvers/index.js";
import { fastify, redis } from "./services.js";
import typeDefs from "./type-defs/index.js";

const STATIC_ROOT = new URL("public", import.meta.url).pathname;

export const APOLLO_SERVER_OPTIONS: ApolloServerOptions<Context> = {
	typeDefs,
	resolvers,
	plugins: [fastifyApolloDrainPlugin(fastify)],
};

export const FASTIFY_CORS_OPTIONS = createFastifyCORSOptions({ service: ServicesNames.PLAYER });

export const FASTIFY_STATIC_OPTIONS = createFastifyStaticOptions({ root: STATIC_ROOT });

export const FASTIFY_REDIS_OPTIONS: FastifyRedisPluginOptions = {
	client: redis,
};

export const FASTIFY_SERVE_CLIENT_OPTIONS: FastifyServeClientOptions = {
	indexPath: new URL("public/index.html", import.meta.url).pathname,
};

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	host: process.env.HOST,
	port: Number.parseInt(process.env.PLAYER_SERVER_PORT),
};
