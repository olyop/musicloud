import type { PoolConfig } from "pg"
import type { PrettyOptions } from "pino-pretty"
import type { FastifyServerOptions } from "fastify"
import type { S3ClientConfig } from "@aws-sdk/client-s3"
import type { FastifyHelmetOptions } from "@fastify/helmet"

import { FILES_URL } from "./globals"

const PINO_PRETTY_OPTIONS: PrettyOptions = {
	singleLine: true,
	translateTime: "HH:MM:ss Z",
	ignore: "pid,hostname,time,reqId,responseTime",
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

export const FASTIFY_HELMET_OPTIONS: FastifyHelmetOptions = {
	hsts: !(process.env.TESTING === "true" || process.env.NODE_ENV === "development"),
	contentSecurityPolicy: {
		directives: {
			imgSrc: ["'self'", FILES_URL],
			connectSrc: ["'self'", FILES_URL],
			fontSrc: ["https://fonts.gstatic.com", "https://fonts.googleapis.com"],
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
	database: process.env.POSTGRESQL_DATABASE,
	password: process.env.POSTGRESQL_PASSWORD,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const

export const AWS_S3_OPTIONS: S3ClientConfig = {
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
	},
}