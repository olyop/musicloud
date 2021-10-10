import fs from "fs"
import { FastifyPluginCallback } from "fastify"

import { CLIENT_ENTRY_PATH } from "./globals"

const serveClient: FastifyPluginCallback =
	(fastify, options, next) => {
		fastify.setNotFoundHandler(
			(request, reply) => {
				reply.type("text/html")
						 .send(fs.createReadStream(CLIENT_ENTRY_PATH))
			},
		)
		next()
	}

export default serveClient