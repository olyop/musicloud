import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyPostgres from "@fastify/postgres";
import serveStatic from "@fastify/static";
import { createFastify } from "@oly_op/musicloud-common/build/create-fastify";
import {
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common/build/create-server-options";
import { serveClient } from "@oly_op/musicloud-common/build/serve-client";
import {
	FASTIFY_HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/musicloud-common/build/server-options";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";

import { Context, createContext } from "./context.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./type-defs/index.js";

const fastify = await createFastify();

const apollo = new ApolloServer<Context>({
	typeDefs,
	resolvers,
	plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

const STATIC_ROOT = new URL("public", import.meta.url).pathname;
const INDEX_DOT_HTML_PATH = new URL("public/index.html", import.meta.url).pathname;

await fastify.register(compress);
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS);
await fastify.register(cors, createFastifyCORSOptions({ service: ServicesNames.PLAYER }));
await fastify.register(serveStatic, createFastifyStaticOptions({ root: STATIC_ROOT }));
await fastify.register(fastifyPostgres, PG_POOL_OPTIONS);
await fastify.register(fastifyApollo(apollo), { context: await createContext() });
await fastify.register(serveClient, { indexPath: INDEX_DOT_HTML_PATH });

await fastify.listen({
	host: process.env.HOST,
	port: Number.parseInt(process.env.PLAYER_SERVER_PORT),
});
