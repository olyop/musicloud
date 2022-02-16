import { PoolConfig } from "pg"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyServerOptions } from "fastify"
import { FastifyCorsOptions } from "fastify-cors"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	connectionTimeout: 5 * 1000,
	logger: process.env.NODE_ENV === "production",
}

export const PG_POOL_OPTIONS: PoolConfig = {
	max: 60,
	parseInputDatesAsUTC: true,
	idleTimeoutMillis: 30 * 1000,
	connectionTimeoutMillis: 5 * 1000,
	user: process.env.AWS_RDS_USERNAME,
	host: process.env.AWS_RDS_ENDPOINT,
	password: process.env.AWS_RDS_PASSWORD,
	database: process.env.AWS_RDS_DATABASE,
}

export const HELMET_OPTIONS: Parameters<typeof fastifyHelmet>[1] = {
	contentSecurityPolicy: false,
}

export const CORS_OPTIONS: FastifyCorsOptions = {
	origin: "*",
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const