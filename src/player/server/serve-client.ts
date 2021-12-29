import fs from "fs"
import { FastifyPluginCallback } from "fastify"

import { CLIENT_ENTRY_PATH } from "./globals"

const serveClient: FastifyPluginCallback =
	(fastify, _options, next) => {
		fastify.setNotFoundHandler(
			(_request, reply) => {
				void reply.type("text/html")
					.send(fs.createReadStream(CLIENT_ENTRY_PATH))
			},
		)
		next()
	}

export default serveClient