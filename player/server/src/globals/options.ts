import { createSigner } from "fast-jwt"
import { FastifyInstance } from "fastify"
import { SearchIndex } from "algoliasearch"
import { FastifyCorsOptions } from "@fastify/cors"
import { FastifyStaticOptions } from "@fastify/static"
import { ServerRegistration } from "apollo-server-fastify"

import { PUBLIC_PATH } from "./paths"

type CreateSignerOptions =
	Parameters<typeof createSigner>[0]

export const SERVE_STATIC_OPTIONS: FastifyStaticOptions = {
	root: PUBLIC_PATH,
}

export const APOLLO_REGISTRATION_OPTIONS: ServerRegistration = {
	cors: false,
}

export const ALGOLIA_SEARCH_OPTIONS: Parameters<SearchIndex["setSettings"]>[0] = {
	customRanking: ["asc(text)"],
	searchableAttributes: ["ordered(text)"],
	attributesForFaceting: ["filter(privacy)"],
}

export const FAST_JWT_SIGNER_OPTIONS: CreateSignerOptions = {
	expiresIn: 1000 * 60 * 60 * 24,
	algorithm: process.env.JWT_ALGORITHM,
	key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
}

export const FASTIFY_CORS_OPTIONS: FastifyCorsOptions = {
	origin:
		process.env.NODE_ENV === "development" ?
			"*" : "https://musicloud-app.com",
}

export const FASTIFY_LISTEN_OPTIONS: Parameters<FastifyInstance["listen"]>[0] = {
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
}