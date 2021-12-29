import fastify from "fastify"
import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
	SERVE_STATIC_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
	APOLLO_REGISTRATION_OPTIONS,
} from "./globals"

import apollo from "./apollo"
import serveClient from "./serve-client"

const listenCallback =
	(error: Error | null, address: string) => {
		if (error) {
			console.error(error)
		} else {
			if (process.env.NODE_ENV === "production") {
				console.log(address)
			}
		}
	}

const start =
	async () => {
		await apollo.start()
		return fastify()
			.register(postgres, PG_POOL_OPTIONS)
			.register(helmet, HELMET_OPTIONS)
			.register(cors, CORS_OPTIONS)
			.register(compress)
			.register(serveStatic, SERVE_STATIC_OPTIONS)
			.register(apollo.createHandler(APOLLO_REGISTRATION_OPTIONS))
			.register(serveClient)
			.listen(FASTIFY_LISTEN_OPTIONS, listenCallback)
	}

void start()