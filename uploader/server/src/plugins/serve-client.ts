import { FastifyPluginCallback } from "fastify"

import { CLIENT_ENTRY_PATH } from "../globals"

export const serveClient: FastifyPluginCallback =
	(fastify, _, next) => {
		fastify.get("/", async (__, reply) => {
			await reply.sendFile(CLIENT_ENTRY_PATH)
		})
		next()
	}