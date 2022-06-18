import { FastifyInstance, FastifyServerOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"
import { FastifyMultipartOptions } from "@fastify/multipart"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 2e+7,
}

export const MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	index: false,
	root: PUBLIC_PATH,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const

export const FASTIFY_LISTEN_OPTIONS: Parameters<FastifyInstance["listen"]>[0] = {
	host: process.env.HOST,
	port: parseInt(process.env.UPLOAD_SERVER_PORT),
}