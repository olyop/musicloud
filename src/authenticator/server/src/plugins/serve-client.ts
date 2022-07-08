import { FastifyPluginAsync } from "fastify"

import { CLIENT_ENTRY_PATH } from "../globals"

const serveClient: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get(
			"/",
			async (request, reply) => (
				reply.sendFile(CLIENT_ENTRY_PATH)
			),
		)
	}

export default serveClient