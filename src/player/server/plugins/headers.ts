import { FastifyPluginCallback } from "fastify"

export const headers: FastifyPluginCallback =
	(fastify, _options, done) => {
		fastify.addHook(
			"onRequest",
			(_request, reply, donee) => {
				void reply.header(
					"Server",
					`${process.release.name}/${process.version.slice(1)}`,
				).send()
				donee()
			},
		)
		done()
	}