import {
	Config,
	runHttpQuery,
	ApolloServerBase,
	isHttpQueryError,
	HttpQueryRequest,
	convertNodeHttpToRequest,
} from "apollo-server-core"

import type {
	FastifyReply,
	FastifyRequest,
	preHandlerAsyncHookHandler,
} from "fastify"

import fastifyAccepts from "@fastify/accepts"
import fp, { PluginMetadata } from "fastify-plugin"
import fastifyCors, { FastifyCorsOptions } from "@fastify/cors"

export interface ApolloFastifyPluginOptions {
	path?: string,
	cors?: FastifyCorsOptions | false,
	disableHealthCheck?: boolean,
	onHealthCheck?: (request: FastifyRequest) => Promise<unknown>,
}

export interface ApolloFastifyContext {
	request: FastifyRequest,
	reply: FastifyReply,
}

export type ApolloFastifyConfig = Config<ApolloFastifyContext>

const pluginMetadata: PluginMetadata = {
	fastify: "3 - 4",
	name: "apollo-server-fastify",
}

export class ApolloServer<CFP = ApolloFastifyContext> extends ApolloServerBase<CFP> {

	protected fastifyHandlerToQuery(context: ApolloFastifyContext): HttpQueryRequest {
		return {
			method: context.request.raw.method || "POST",
			request: convertNodeHttpToRequest(context.request.raw),
			options: () => this.graphQLServerOptions(context),
			query: (
				context.request.raw.method === "POST" ?
					context.request.body :
					context.request.query
			) as Record<string, unknown>,
		}
	}

	public createPlugin() {
		return fp<ApolloFastifyPluginOptions>(
			async (fastify, options) => {
				const {
					cors = false,
					path = "/graphql",
					onHealthCheck,
					disableHealthCheck = false,
				} = options

				this.graphqlPath = path
				this.assertStarted("createHandler")

				const landingPage = this.getLandingPage()

				if (!disableHealthCheck) {
					fastify.get(
						"/.well-known/apollo/server-health",
						async (request, reply) => {
							// Response follows: https://tools.ietf.org/html/draft-inadarei-api-health-check-01
							void reply.type("application/health+json")

							const pass = "{\"status\":\"pass\"}"
							const fail = "{\"status\":\"fail\"}"

							if (onHealthCheck) {
								try {
									await onHealthCheck(request)
									return pass
								} catch (e) {
									void reply.status(503)
									return fail
								}
							} else {
								return pass
							}
						},
					)
				}

				await fastify.register(
					async instance => {
						await instance.register(fastifyAccepts)

						if (cors) {
							await instance.register(fastifyCors, cors)
						}

						instance.setNotFoundHandler(
							(_, reply) => {
								void reply.header("Allow", "GET, POST")
								void reply.code(405)
								return Promise.resolve()
							},
						)

						const preHandler: preHandlerAsyncHookHandler | undefined =
							landingPage ?
								async (request, reply) => {
									if (request.raw.method === "GET") {
										const accept = request.accepts()
										const types = accept.types()

										if (Array.isArray(types)) {
											const prefersHTML =
												types.find(x => (
													x === "text/html" || x === "application/json"
												)) === "text/html"

											if (prefersHTML) {
												void reply.type("text/html")
												return landingPage.html
											} else {
												return Promise.resolve()
											}
										} else {
											return Promise.resolve()
										}
									} else {
										return Promise.resolve()
									}
								} :
								undefined

						return instance.route({
							url: "/",
							preHandler,
							method: ["GET", "POST"],
							handler: async (request, reply) => {
								try {
									const { graphqlResponse, responseInit } =
										await runHttpQuery(
											[],
											this.fastifyHandlerToQuery({ request, reply }),
											this.csrfPreventionRequestHeaders,
										)

									if (responseInit.headers) {
										for (const [name, value] of Object.entries(responseInit.headers)) {
											void reply.header(name, value)
										}
									}

									void reply.status(responseInit.status || 200)
									void reply.serializer((payload: string) => payload)

									return graphqlResponse
								} catch (error) {
									if (!isHttpQueryError(error)) {
										throw error
									}

									if (error.headers) {
										for (const [header, value] of Object.entries(error.headers)) {
											void reply.header(header, value)
										}
									}

									void reply.code(error.statusCode)
									void reply.serializer((payload: string) => payload)

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
			pluginMetadata,
		)
	}

}