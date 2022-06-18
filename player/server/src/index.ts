import cors from "@fastify/cors"
import createFastify from "fastify"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import { PG_POOL_OPTIONS, FASTIFY_SERVER_OPTIONS } from "@oly_op/musicloud-common"

import apollo from "./apollo"
import serveClient from "./serve-client"
import { preValidationHook, multiPartContentTypeParser } from "./fastify-hooks"
import { SERVE_STATIC_OPTIONS, FASTIFY_CORS_OPTIONS, APOLLO_PLUGIN_OPTIONS } from "./globals"

await apollo.start()

const fastify = createFastify({
	...FASTIFY_SERVER_OPTIONS,
})

fastify.addContentTypeParser("multipart/form-data", multiPartContentTypeParser)
fastify.addHook("preValidation", preValidationHook)

await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(cors, FASTIFY_CORS_OPTIONS)
await fastify.register(compress)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(apollo.createPlugin(), APOLLO_PLUGIN_OPTIONS)
await fastify.register(serveClient)

await fastify.listen({
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
})