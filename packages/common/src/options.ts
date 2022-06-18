import { PoolConfig } from "pg"
import { FastifyServerOptions } from "fastify"
import { fastifyHelmet } from "@fastify/helmet"

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
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
	host: process.env.POSTGRESQL_HOSTNAME,
	user: process.env.POSTGRESQL_USERNAME,
	password: process.env.POSTGRESQL_PASSWORD,
	database: process.env.POSTGRESQL_DATABASE,
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