import cors from "fastify-cors"
import createFastify from "fastify"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import { processRequest } from "graphql-upload"
import { PG_POOL_OPTIONS, FASTIFY_SERVER_OPTIONS } from "@oly_op/musicloud-common"

import {
	SERVE_STATIC_OPTIONS,
	FASTIFY_CORS_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
	APOLLO_REGISTRATION_OPTIONS,
} from "./globals"

import apollo from "./apollo"
import serveClient from "./serve-client"

const fastify =
	createFastify(FASTIFY_SERVER_OPTIONS)

fastify.addContentTypeParser(
	"multipart/form-data",
	(request, payload, done) => {
		request.isMultipart = true
		done(null)
	},
)

fastify.addHook(
	"preValidation",
	async (request, reply) => {
		if (request.isMultipart) {
			request.body =
				await processRequest(
					request.raw,
					reply.raw,
				)
		}
	},
)

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