import { FastifyServerOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"
import { FastifyMultipartOptions } from "@fastify/multipart"
import { FASTIFY_SERVER_OPTIONS as FASTIFY_SERVER_BASE_OPTIONS } from "@oly_op/musicloud-common"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	...FASTIFY_SERVER_BASE_OPTIONS,
	bodyLimit: 2e+7,
}

export const MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
}

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	root: PUBLIC_PATH,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const

export const FASTIFY_LISTEN_OPTIONS = {
	host: process.env.HOST,
	port: parseInt(process.env.UPLOADER_SERVER_PORT),
}