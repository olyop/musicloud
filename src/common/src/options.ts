import { PoolConfig } from "pg"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyCorsOptions } from "fastify-cors"

export const PG_POOL_OPTIONS: PoolConfig = {
	parseInputDatesAsUTC: true,
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