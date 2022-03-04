import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/music-app-common/options"

import apollo from "./apollo"
import fastify from "./fastify"
import serveClient from "./serve-client"
import { SERVE_STATIC_OPTIONS, APOLLO_REGISTRATION_OPTIONS } from "./globals"

void (async () => {
	await apollo.start()

	await fastify.register(postgres, PG_POOL_OPTIONS)
	await fastify.register(helmet, HELMET_OPTIONS)
	await fastify.register(cors, CORS_OPTIONS)
	await fastify.register(compress)
	await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	await fastify.register(apollo.createHandler(APOLLO_REGISTRATION_OPTIONS))
	await fastify.register(serveClient)

	const address =
		await fastify.listen(
			parseInt(process.env.PLAYER_SERVER_PORT),
			process.env.HOST,
		)

	if (process.env.NODE_ENV === "production") {
		console.log(address)
	}
})()