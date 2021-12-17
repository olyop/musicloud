import { FastifyPluginCallback } from "fastify"

import { CLIENT_ENTRY_PATH } from "../globals"

export const serveClient: FastifyPluginCallback =
	(fastify, options, next) => {
		fastify.get("/", async (request, reply) => {
			await reply.sendFile(CLIENT_ENTRY_PATH)
		})
		next()
	}