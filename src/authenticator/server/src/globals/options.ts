import { FastifyServerOptions } from "fastify"
import { FASTIFY_SERVER_OPTIONS as FASTIFY_SERVER_BASE_OPTIONS } from "@oly_op/musicloud-common"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	...FASTIFY_SERVER_BASE_OPTIONS,
	bodyLimit: 2e+7,
}

export const FASTIFY_LISTEN_OPTIONS = {
	host: process.env.HOST,
	port: parseInt(process.env.AUTHENTICATOR_SERVER_PORT),
}