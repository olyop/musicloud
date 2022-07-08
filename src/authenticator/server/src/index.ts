import createFastify from "fastify"
import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import { HELMET_OPTIONS } from "@oly_op/musicloud-common"

import { api, services, serveClient } from "./plugins"
import { SERVE_STATIC_OPTIONS, FASTIFY_SERVER_OPTIONS } from "./globals"

const fastify = createFastify(FASTIFY_SERVER_OPTIONS)

await fastify.register(helmet, HELMET_OPTIONS)
await fastify.register(compress)
await fastify.register(services)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(api)
await fastify.register(serveClient)

await fastify.listen({
	host: process.env.HOST,
	port: parseInt(process.env.AUTHENTICATOR_SERVER_PORT),
})