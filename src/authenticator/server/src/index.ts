import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { fastifyStatic } from "@fastify/static";
import { createFastify } from "@oly_op/musicloud-common/build/create-fastify";
import {
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common/build/create-server-options";
import { serveClient } from "@oly_op/musicloud-common/build/serve-client";
import { FASTIFY_HELMET_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";

import { api, services } from "./plugins/index.js";

const STATIC_ROOT = new URL("public", import.meta.url).pathname;
const INDEX_DOT_HTML_PATH = new URL("public/index.html", import.meta.url).pathname;

const fastify = await createFastify();

await fastify.register(helmet, FASTIFY_HELMET_OPTIONS);
await fastify.register(cors, createFastifyCORSOptions({ service: ServicesNames.AUTHENTICATOR }));
await fastify.register(fastifyStatic, createFastifyStaticOptions({ root: STATIC_ROOT }));
await fastify.register(compress);
await fastify.register(services);
await fastify.register(api);
await fastify.register(serveClient, { indexPath: INDEX_DOT_HTML_PATH });

await fastify.listen({
	host: process.env.HOST,
	port: Number.parseInt(process.env.AUTHENTICATOR_SERVER_PORT),
});
