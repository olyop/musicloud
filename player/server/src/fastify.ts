import createFastify from "fastify"

import { processRequest } from "graphql-upload"
import { FASTIFY_SERVER_OPTIONS } from "@oly_op/music-app-common/options"

declare module "fastify" {
	export interface FastifyRequest {
		isMultipart: boolean,
	}
}

const fastify =
	createFastify(FASTIFY_SERVER_OPTIONS)

fastify.addContentTypeParser(
	"multipart/form-data",
	(request, _payload, done) => {
		request.isMultipart = true
		done(null)
	},
)

fastify.addHook(
	"preValidation",
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (request, reply) => {
		if (request.isMultipart) {
			request.body =
				await processRequest(request.raw, reply.raw)
		}
	},
)

export default fastify