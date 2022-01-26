import fastify from "fastify"
import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import listenCallback from "@oly_op/music-app-common/fastify-listen-callback"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/music-app-common/options"

import apollo from "./apollo"
import serveClient from "./serve-client"
import { SERVE_STATIC_OPTIONS, APOLLO_REGISTRATION_OPTIONS } from "./globals"

const start =
	async () => {
		await apollo.start()
		return (
			fastify()
				.register(postgres, PG_POOL_OPTIONS)
				.register(helmet, HELMET_OPTIONS)
				.register(cors, CORS_OPTIONS)
				.register(compress)
				.register(serveStatic, SERVE_STATIC_OPTIONS)
				.register(apollo.createHandler(APOLLO_REGISTRATION_OPTIONS))
				.register(serveClient)
				.listen(
					parseInt(process.env.PLAYER_SERVER_PORT),
					process.env.HOST,
					listenCallback,
				)
		)
	}

void start()