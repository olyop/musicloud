import { PoolConfig } from "pg"
import { FastifyInstance } from "fastify"
import { SignOptions } from "jsonwebtoken"
import { SearchIndex } from "algoliasearch"
import { fastifyHelmet } from "fastify-helmet"
import { FastifyCorsOptions } from "fastify-cors"
import { FastifyStaticOptions } from "fastify-static"
import { ServerRegistration } from "apollo-server-fastify"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_LISTEN_OPTIONS: Parameters<FastifyInstance["listen"]>[0] = {
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
}

export const CORS_OPTIONS: FastifyCorsOptions = {
	origin: "*",
}

export const HELMET_OPTIONS: Parameters<typeof fastifyHelmet>[1] = {
	contentSecurityPolicy: false,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	root: PUBLIC_PATH,
}

export const JWT_SIGN_OPTIONS: SignOptions = {
	expiresIn: "1d",
	algorithm: "HS256",
}

export const APOLLO_REGISTRATION_OPTIONS: ServerRegistration = {
	cors: false,
}

export const PG_POOL_OPTIONS: PoolConfig = {
	parseInputDatesAsUTC: true,
	idleTimeoutMillis: 1000 * 2,
	user: process.env.AWS_RDS_USERNAME,
	host: process.env.AWS_RDS_ENDPOINT,
	password: process.env.AWS_RDS_PASSWORD,
	database: process.env.AWS_RDS_DATABASE,
}

export const ALGOLIA_OPTIONS = [
	process.env.ALGOLIA_APPLICATION_ID,
	process.env.ALGOLIA_ADMIN_API_KEY,
] as const

export const ALGOLIA_SEARCH_OPTIONS: Parameters<SearchIndex["setSettings"]>[0] = {
	customRanking: ["asc(text)"],
	searchableAttributes: ["ordered(text)"],
	attributesForFaceting: ["filter(privacy)"],
}