import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import { processRequest } from "graphql-upload"
import listenCallback from "@oly_op/music-app-common/fastify-listen-callback"
import fastify, { FastifyContentTypeParser, onRequestHookHandler } from "fastify"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
	FASTIFY_SERVER_OPTIONS,
} from "@oly_op/music-app-common/options"

import apollo from "./apollo"
import { serveClient } from "./plugins"
import { SERVE_STATIC_OPTIONS, APOLLO_REGISTRATION_OPTIONS } from "./globals"

const multiPartParser: FastifyContentTypeParser =
	(request, _payload, done) => {
		request.isMultipart = true
		done(null)
	}

const preValidationHook: onRequestHookHandler =
	async (request, reply) => {
		if (!request.isMultipart) {
			return
		}
		request.body = await processRequest(request.raw, reply.raw)
	}

const start =
	async () => {
		await apollo.start()
		const server = fastify(FASTIFY_SERVER_OPTIONS)
		server.addContentTypeParser("multipart", multiPartParser)
		server.addHook("preValidation", preValidationHook)
		return (
			server
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