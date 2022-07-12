import type { PoolConfig } from "pg"
import type { PrettyOptions } from "pino-pretty"
import type { FastifyServerOptions } from "fastify"
import type { fastifyHelmet } from "@fastify/helmet"

const PINO_PRETTY_OPTIONS: PrettyOptions = {
	singleLine: true,
	ignore: "pid,hostname",
	translateTime: "HH:MM:ss Z",
}

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	connectionTimeout: 5 * 1000,
	logger: process.env.NODE_ENV === "development" ? undefined : {
		transport: {
			target: "pino-pretty",
			options: PINO_PRETTY_OPTIONS,
		},
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