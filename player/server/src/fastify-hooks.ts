import { processRequest } from "graphql-upload"
import { FastifyContentTypeParser, preValidationAsyncHookHandler } from "fastify"

export const multiPartContentTypeParser: FastifyContentTypeParser =
	(request, payload, done) => {
		request.isMultipart = true
		done(null)
	}

export const preValidationHook: preValidationAsyncHookHandler =
	async (request, reply) => {
		if (request.isMultipart) {
			request.body =
				await processRequest(
					request.raw,
					reply.raw,
				)
		}
	}