import { FastifyPluginCallback } from "fastify"

import { CLIENT_ENTRY_PATH } from "./globals"

const serveClient: FastifyPluginCallback =
	(fastify, options, next) => {
		fastify.setNotFoundHandler((request, reply) => {
			reply.sendFile(CLIENT_ENTRY_PATH)
		})
		next()
	}

export default serveClient