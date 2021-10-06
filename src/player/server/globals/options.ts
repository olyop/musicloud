import { SignOptions } from "jsonwebtoken"
import { PoolConfig } from "@oly_op/pg-helpers"
import { FastifyCorsOptions } from "fastify-cors"
import { FastifyHelmetOptions } from "fastify-helmet"
import { FastifyStaticOptions } from "fastify-static"
import { ServerRegistration } from "apollo-server-fastify"

import {
	HOST,
	PORT,
	ALGOLIA_API_KEY,
	AWS_RDS_USERNAME,
	AWS_RDS_DATABASE,
	AWS_RDS_ENDPOINT,
	AWS_RDS_PASSWORD,
	ALGOLIA_APPLICATION_ID,
} from "./environment"

import { PUBLIC_PATH } from "./paths"

export const FASTIFY_LISTEN_OPTIONS = {
	port: PORT,
	host: HOST,
}

export const CORS_OPTIONS: FastifyCorsOptions = {
	origin: "*",
}

export const HELMET_OPTIONS: FastifyHelmetOptions = {
	contentSecurityPolicy: false,
}

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	index: false,
	root: PUBLIC_PATH,
}

export const JWT_SIGN_OPTIONS: SignOptions = {
	expiresIn: "3d",
	algorithm: "HS256",
}

export const APOLLO_REGISTRATION_OPTIONS: ServerRegistration = {
	cors: false,
}

export const PG_POOL_OPTIONS: PoolConfig = {
	user: AWS_RDS_USERNAME,
	host: AWS_RDS_ENDPOINT,
	password: AWS_RDS_PASSWORD,
	database: AWS_RDS_DATABASE,
	parseInputDatesAsUTC: true,
	idleTimeoutMillis: 1000 * 2,
}

export const ALGOLIA_OPTIONS: [string, string] = [
	ALGOLIA_APPLICATION_ID,
	ALGOLIA_API_KEY,
]