import { PoolConfig } from "pg"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyCorsOptions } from "fastify-cors"
import { FastifyStaticOptions } from "fastify-static"
import { FastifyMultipartOptions } from "fastify-multipart"
import { FastifyInstance, FastifyServerOptions } from "fastify"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_LISTEN_OPTIONS: Parameters<FastifyInstance["listen"]>[0] = {
	host: process.env.HOST,
	port: parseInt(process.env.UPLOAD_SERVER_PORT),
}

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 2e+7,
}

export const MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
}

export const HELMET_OPTIONS: Parameters<typeof fastifyHelmet>[1] = {
	contentSecurityPolicy: false,
}

export const CORS_OPTIONS: FastifyCorsOptions = {
	origin: "*",
}

export const PG_POOL_OPTIONS: PoolConfig = {
	parseInputDatesAsUTC: true,
	user: process.env.AWS_RDS_USERNAME,
	host: process.env.AWS_RDS_ENDPOINT,
	database: process.env.AWS_RDS_DATABASE,
	password: process.env.AWS_RDS_PASSWORD,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	index: false,
	root: PUBLIC_PATH,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const