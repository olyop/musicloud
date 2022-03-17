import cors from "fastify-cors"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import { PG_POOL_OPTIONS } from "@oly_op/musicloud-common"

import {
	SERVE_STATIC_OPTIONS,
	FASTIFY_CORS_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
	APOLLO_REGISTRATION_OPTIONS,
} from "./globals"

import apollo from "./apollo"
import fastify from "./fastify"
import serveClient from "./serve-client"

void (async () => {
	await apollo.start()

	await fastify.register(postgres, PG_POOL_OPTIONS)
	await fastify.register(cors, FASTIFY_CORS_OPTIONS)
	await fastify.register(compress)
	await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
	await fastify.register(apollo.createHandler(APOLLO_REGISTRATION_OPTIONS))
	await fastify.register(serveClient)

	await fastify.listen(FASTIFY_LISTEN_OPTIONS)
})()