import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multiPart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import serveStatic from "@fastify/static";
import { createFastify } from "@oly_op/musicloud-common/build/create-fastify";
import {
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common/build/create-server-options";
import { serveClient } from "@oly_op/musicloud-common/build/serve-client";
import { FASTIFY_HELMET_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";

import { FASTIFY_MULTIPART_OPTIONS } from "./options";
import { api, jwt, services } from "./plugins";

const STATIC_ROOT = new URL("public", import.meta.url).pathname;
const INDEX_DOT_HTML_PATH = new URL("public/index.html", import.meta.url).pathname;

const fastify = await createFastify();

await fastify.register(rateLimit);
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS);
await fastify.register(compress);
await fastify.register(multiPart, FASTIFY_MULTIPART_OPTIONS);
await fastify.register(cors, createFastifyCORSOptions({ service: ServicesNames.UPLOADER }));
await fastify.register(serveStatic, createFastifyStaticOptions({ root: STATIC_ROOT }));
await fastify.register(services);
await fastify.register(jwt);
await fastify.register(api, { prefix: "/api" });
await fastify.register(serveClient, { indexPath: INDEX_DOT_HTML_PATH });

await fastify.listen({
	host: process.env.HOST,
	port: Number.parseInt(process.env.UPLOADER_SERVER_PORT),
});
