import { Config } from "apollo-server-core"
import { FastifyCorsOptions } from "@fastify/cors"
import { FastifyReply, FastifyRequest } from "fastify"

export interface ApolloFastifyPluginOptions {
	path?: string,
	disableHealthCheck?: boolean,
	cors?: FastifyCorsOptions | false,
	onHealthCheck?: (request: FastifyRequest) => Promise<unknown>,
}

export interface ApolloFastifyContext {
	request: FastifyRequest,
	reply: FastifyReply,
}

export type ApolloFastifyConfig = Config<ApolloFastifyContext>

/** @deprecated please use ApolloFastifyContext */
export type FastifyContext = ApolloFastifyContext

/** @deprecated please use ApolloFastifyConfig */
export type ApolloServerFastifyConfig = ApolloFastifyConfig

/** @deprecated please use ApolloFastifyPluginOptions */
export type ServerRegistration = ApolloFastifyPluginOptions