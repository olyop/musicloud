import {
	runHttpQuery,
	ApolloServerBase,
	isHttpQueryError,
	HttpQueryRequest,
	convertNodeHttpToRequest,
} from "apollo-server-core"

import fastifyCors from "@fastify/cors"
import fastifyPlugin from "fastify-plugin"
import fastifyAccepts from "@fastify/accepts"
import type { FastifyRequest } from "fastify"
import { ApolloFastifyContext, ApolloFastifyPluginOptions } from "./types"

function prefersHTML(request: FastifyRequest) {
  const accepts = request.accepts()
  const types = accepts.types()
  if (Array.isArray(types)) {
		return types.find(x => x === 'text/html' || x === 'application/json') === 'text/html'
	} else {
		return false
	}
}

export class ApolloServer<
	ContextFunctionParams extends ApolloFastifyContext = ApolloFastifyContext
> extends ApolloServerBase<ContextFunctionParams> {

	protected fastifyHandlerToQuery =
		async (context: ApolloFastifyContext): Promise<HttpQueryRequest> => ({
			method: context.request.raw.method || "POST",
			options: await this.graphQLServerOptions(context),
			request: convertNodeHttpToRequest(context.request.raw),
			query: (
				context.request.raw.method === "POST" ?
					context.request.body :
					context.request.query
			) as Record<string, unknown>,
		})

	public plugin =
		fastifyPlugin<ApolloFastifyPluginOptions>(
			async (fastify, options) => {
				const {
					cors = false,
					path = "/graphql",
					onHealthCheck,
					disableHealthCheck = false,
				} = options

				this.assertStarted("createHandler")

				const landingPage = this.getLandingPage()

				if (!disableHealthCheck) {
					fastify.get(
						"/.well-known/apollo/server-health",
						async (request, reply) => {
							// Response follows: https://tools.ietf.org/html/draft-inadarei-api-health-check-01
							void reply.type("application/health+json")

							if (onHealthCheck) {
								try {
									await onHealthCheck(request)
									return { status: 'pass' }
								} catch (e) {
									void reply.status(503)
									return { status: 'fail' }
								}
							} else {
								return { status: 'pass' }
							}
						},
					)
				}

				this.graphqlPath = path

				await fastify.register(
					async instance => {
						await instance.register(fastifyAccepts)

						if (cors) {
							await instance.register(fastifyCors, cors)
						}

						instance.setNotFoundHandler(
							async (_, reply) => {
								await reply.header("Allow", "GET, POST")
								await reply.code(405)
								return ""
							},
						)

						instance.route({
							url: "/",
							method: ["GET", "POST"],
							handler: async (request, reply) => {
								if (landingPage && request.method === "GET" && prefersHTML(request)) {
									reply.type("text/html")
									return landingPage.html
								}

								try {
									const { graphqlResponse, responseInit } =
										await runHttpQuery(
											[],
											await this.fastifyHandlerToQuery({ request, reply }),
											this.csrfPreventionRequestHeaders,
										)

									if (responseInit.headers) {
										for (const [name, value] of Object.entries(responseInit.headers)) {
											void reply.header(name, value)
										}
									}

									await reply.status(responseInit.status || 200)
									await reply.serializer((payload: string) => payload)

									return graphqlResponse
								} catch (error) {
									if (!isHttpQueryError(error)) {
										throw error
									}

									if (error.headers) {
										for (const [header, value] of Object.entries(error.headers)) {
											await reply.header(header, value)
										}
									}

									await reply.code(error.statusCode)

									return error.message
								}
							},
						})
					},
					{
						prefix: this.graphqlPath,
					},
				)
			},
			{
				fastify: "3 - 4",
				name: "apollo-server-fastify",
			},
		)
}