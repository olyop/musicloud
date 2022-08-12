import ms from "ms"
import type { PoolConfig } from "pg"
import type { S3ClientConfig } from "@aws-sdk/client-s3"
import type { FastifyHelmetOptions } from "@fastify/helmet"
import type { FastifyStaticOptions } from "@fastify/static"

import { IS_PRODUCTION, IS_TESTING, FILES_URL } from "./globals"

const GOOGLE_FONTS_CSS_ORIGIN = "https://fonts.googleapis.com"
const GOOGLE_FONTS_FONT_ORIGIN = "https://fonts.gstatic.com"

export const FASTIFY_HELMET_OPTIONS: FastifyHelmetOptions = {
	hsts: IS_PRODUCTION && !IS_TESTING,
	contentSecurityPolicy: {
		directives: {
			workerSrc: ["'self'"],
			imgSrc: ["'self'", FILES_URL],
			fontSrc: ["'self'", GOOGLE_FONTS_FONT_ORIGIN],
			styleSrc: ["'self'", GOOGLE_FONTS_CSS_ORIGIN],
			connectSrc: ["'self'", FILES_URL, GOOGLE_FONTS_CSS_ORIGIN, GOOGLE_FONTS_FONT_ORIGIN],
		},
	},
}

export const FASTIFY_STATIC_OPTIONS: Partial<FastifyStaticOptions> = {
	index: false,
}

export const PG_POOL_OPTIONS: PoolConfig = {
	max: 60,
	parseInputDatesAsUTC: true,
	idleTimeoutMillis: ms("15s"),
	connectionTimeoutMillis: ms("15s"),
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