import { FastifyServerOptions } from "fastify"
import { PoolConfig } from "@oly_op/pg-helpers"
import { FastifyCorsOptions } from "fastify-cors"
import { FastifyHelmetOptions } from "fastify-helmet"
import { FastifyStaticOptions } from "fastify-static"
import { FastifyMultipartOptions } from "fastify-multipart"

import {
	HOST,
	PORT,
	ALGOLIA_API_KEY,
	AWS_RDS_USERNAME,
	AWS_RDS_DATABASE,
	AWS_RDS_ENDPOINT,
	AWS_RDS_PASSWORD,
	ALGOLIA_APPLICATION_ID,
} from "./environment"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_LISTEN_OPTIONS = {
	host: HOST,
	port: PORT,
}

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 2e+7,
}

export const MULTIPART_OPTIONS: FastifyMultipartOptions = {
	addToBody: true,
}

export const HELMET_OPTIONS: FastifyHelmetOptions = {
	contentSecurityPolicy: false,
}

export const CORS_OPTIONS: FastifyCorsOptions = {
	origin: "*",
}

export const PG_POOL_OPTIONS: PoolConfig = {
	user: AWS_RDS_USERNAME,
	host: AWS_RDS_ENDPOINT,
	database: AWS_RDS_DATABASE,
	password: AWS_RDS_PASSWORD,
	parseInputDatesAsUTC: true,
	idleTimeoutMillis: 1000 * 2,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	index: false,
	root: PUBLIC_PATH,
}

export const ALGOLIA_OPTIONS = [
	ALGOLIA_APPLICATION_ID,
	ALGOLIA_API_KEY,
] as const