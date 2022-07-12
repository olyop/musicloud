import { FastifyServerOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 2e+7,
}

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	root: PUBLIC_PATH,
}

export const FASTIFY_LISTEN_OPTIONS = {
	host: process.env.HOST,
	port: parseInt(process.env.AUTHENTICATOR_SERVER_PORT),
}