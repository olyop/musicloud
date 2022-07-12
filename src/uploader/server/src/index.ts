import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"
import { createFastifyCORSOptions, HELMET_OPTIONS } from "@oly_op/musicloud-common"

import fastify from "./fastify"
import { api, services } from "./plugins"
import { FASTIFY_STATIC_OPTIONS, FASTIFY_LISTEN_OPTIONS } from "./globals"

await fastify.register(rateLimit)
await fastify.register(helmet, HELMET_OPTIONS)
await fastify.register(compress)
await fastify.register(cors, createFastifyCORSOptions({ service: "uploader" }))
await fastify.register(serveStatic, FASTIFY_STATIC_OPTIONS)
await fastify.register(services)
await fastify.register(api)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)