import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"

import {
	PG_POOL_OPTIONS,
	FASTIFY_HELMET_OPTIONS,
	createFastifyCORSOptions,
	createFastifyStaticOptions,
} from "@oly_op/musicloud-common"

import apollo from "./apollo"
import fastify from "./fastify"
import serveClient from "./serve-client"
import { PUBLIC_PATH, APOLLO_PLUGIN_OPTIONS, FASTIFY_LISTEN_OPTIONS } from "./globals"

await apollo.start()

await fastify.register(rateLimit)
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS)
await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(cors, createFastifyCORSOptions({ service: "player" }))
await fastify.register(compress)
await fastify.register(serveStatic, createFastifyStaticOptions(PUBLIC_PATH))
await fastify.register(apollo.plugin, APOLLO_PLUGIN_OPTIONS)
await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)