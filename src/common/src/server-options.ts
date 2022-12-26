import type { S3ClientConfig } from "@aws-sdk/client-s3";
import type { FastifyHelmetOptions } from "@fastify/helmet";
import ms from "ms";
import type { PoolConfig } from "pg";

import { FILES_URL, IS_DEVELOPMENT, IS_PRODUCTION, IS_TESTING, USE_HTTPS } from "./globals.js";

const GOOGLE_FONTS_FONT_ORIGIN = "https://fonts.gstatic.com";
const GOOGLE_FONTS_CSS_ORIGIN = "https://fonts.googleapis.com";
const ALGOLIA_SEARCH_ORIGINS = ["https://*.algolia.net", "https://*.algolianet.com"];

const APOLLO_STUDIO_ORIGINS = ["https://*.apollographql.com"];

export const FASTIFY_HELMET_OPTIONS: FastifyHelmetOptions = {
	hsts: USE_HTTPS ? IS_PRODUCTION && !IS_TESTING : false,
	crossOriginEmbedderPolicy: !IS_DEVELOPMENT,
	contentSecurityPolicy: {
		directives: {
			workerSrc: ["'self'"],
			fontSrc: ["'self'", GOOGLE_FONTS_FONT_ORIGIN],
			manifestSrc: ["'self'", ...(IS_DEVELOPMENT ? APOLLO_STUDIO_ORIGINS : [])],
			imgSrc: ["'self'", "blob:", FILES_URL, ...(IS_DEVELOPMENT ? APOLLO_STUDIO_ORIGINS : [])],
			frameSrc: ["'self'", ...(IS_DEVELOPMENT ? APOLLO_STUDIO_ORIGINS : [])],
			styleSrc: [
				"'self'",
				GOOGLE_FONTS_CSS_ORIGIN,
				...(IS_DEVELOPMENT ? [...APOLLO_STUDIO_ORIGINS, "'unsafe-inline'"] : []),
			],
			scriptSrc: [
				"'self'",
				...(IS_DEVELOPMENT ? [...APOLLO_STUDIO_ORIGINS, "'unsafe-inline'"] : []),
			],
			connectSrc: [
				"'self'",
				FILES_URL,
				...ALGOLIA_SEARCH_ORIGINS,
				GOOGLE_FONTS_CSS_ORIGIN,
				GOOGLE_FONTS_FONT_ORIGIN,
			],
		},
	},
};

export const PG_POOL_OPTIONS: PoolConfig = {
	max: 60,
	idleTimeoutMillis: ms("30s"),
	connectionTimeoutMillis: ms("30s"),
	host: process.env.POSTGRESQL_HOSTNAME,
	user: process.env.POSTGRESQL_USERNAME,
	database: process.env.POSTGRESQL_DATABASE,
	password: process.env.POSTGRESQL_PASSWORD,
};

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const;

export const AWS_S3_OPTIONS: S3ClientConfig = {
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
	},
};
