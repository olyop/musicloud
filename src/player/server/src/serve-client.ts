/* eslint-disable @typescript-eslint/require-await */
import { FastifyPluginAsync } from "fastify"

import { CLIENT_ENTRY_PATH } from "./globals"

const serveClient: FastifyPluginAsync =
	async fastify => {
		fastify.get(
			"/",
			async (request, reply) => (
				reply.sendFile(CLIENT_ENTRY_PATH)
			),
		)
	}

export default serveClient