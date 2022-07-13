import fs from "fs"
import { FastifyPluginAsync } from "fastify"

import { CLIENT_ENTRY_PATH } from "../globals"

export const serveClient: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.setNotFoundHandler(
			(request, reply) => {
				const stream = fs.createReadStream(CLIENT_ENTRY_PATH)
				void reply.type("text/html").send(stream)
			},
		)
	}