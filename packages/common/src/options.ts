import { PoolConfig } from "pg"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyServerOptions } from "fastify"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	bodyLimit: 20971520,
	connectionTimeout: 5 * 1000,
	logger: process.env.NODE_ENV === "production" && {
		prettyPrint: true,
	},
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

type HelmetOptions =
	Parameters<typeof fastifyHelmet>[1]

export const HELMET_OPTIONS: HelmetOptions = {
	contentSecurityPolicy: false,
	crossOriginResourcePolicy: false,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const