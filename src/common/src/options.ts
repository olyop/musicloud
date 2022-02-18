import { PoolConfig } from "pg"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyCorsOptions } from "fastify-cors"
import { FastifyLoggerOptions, FastifyServerOptions } from "fastify"

const IS_PROD =
	process.env.NODE_ENV === "production"

const fastifyLogger: FastifyLoggerOptions = {
	prettyPrint: {
		translateTime: true,
		messageFormat: "{msg} [{req.method} {req.url}]",
		ignore: "pid, hostname, reqId, responseTime, req, res",
	}
}

export const FASTIFY_SERVER_OPTIONS: FastifyServerOptions = {
	connectionTimeout: 5 * 1000,
	logger: IS_PROD && fastifyLogger,
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
	maxAge: 60 * 60,
	origin: IS_PROD ? [
		"https://musicloud-app.com",
		"https://manage.auth0.com",
	] : [
		"http://127.0.0.1:3001",
	],
	methods: [
		"GET",
		"POST",
	]
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const