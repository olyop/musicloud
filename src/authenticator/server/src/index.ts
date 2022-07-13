import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"

import {
	FASTIFY_HELMET_OPTIONS,
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common"

import fastify from "./fastify"
import { api, serveClient, services } from "./plugins"
import { PUBLIC_PATH, FASTIFY_LISTEN_OPTIONS } from "./globals"

await fastify.register(rateLimit)
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS)
await fastify.register(cors, createFastifyCORSOptions({ service: "authenticator" }))
await fastify.register(compress)
await fastify.register(services)
await fastify.register(serveStatic, createFastifyStaticOptions(PUBLIC_PATH))
await fastify.register(api)
await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)