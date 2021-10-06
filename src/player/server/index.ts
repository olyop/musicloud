import fastify from "fastify"
import cors from "fastify-cors"
import helmet from "fastify-helmet"
import compress from "fastify-compress"
import serveStatic from "fastify-static"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	SERVE_STATIC_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
	APOLLO_REGISTRATION_OPTIONS,
} from "./globals"

import apollo from "./apollo"
import serveClient from "./serve-client"

(async () => {
	await apollo.start()
	return fastify()
		.register(helmet, HELMET_OPTIONS)
		.register(cors, CORS_OPTIONS)
		.register(compress)
		.register(serveStatic, SERVE_STATIC_OPTIONS)
		.register(apollo.createHandler(APOLLO_REGISTRATION_OPTIONS))
		.register(serveClient)
		.listen(FASTIFY_LISTEN_OPTIONS)
})()