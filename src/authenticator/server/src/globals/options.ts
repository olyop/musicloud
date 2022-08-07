import { FastifyListenOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"
import { FASTIFY_STATIC_OPTIONS as FASTIFY_STATIC_BASE_OPTIONS } from "@oly_op/musicloud-common/build/server-options"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	...FASTIFY_STATIC_BASE_OPTIONS,
	root: PUBLIC_PATH,
}

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	host: process.env.HOST,
	port: parseInt(process.env.AUTHENTICATOR_SERVER_PORT),
}