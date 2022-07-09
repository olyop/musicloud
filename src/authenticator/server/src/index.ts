import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import { HELMET_OPTIONS } from "@oly_op/musicloud-common"

import fastify from "./fastify"
import { api, services, serveClient } from "./plugins"
import { SERVE_STATIC_OPTIONS, FASTIFY_LISTEN_OPTIONS } from "./globals"

await fastify.register(helmet, HELMET_OPTIONS)
await fastify.register(compress)
await fastify.register(services)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(api)
await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)