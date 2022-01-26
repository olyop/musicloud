import { SearchIndex } from "algoliasearch"
import { FastifyStaticOptions } from "fastify-static"
import { ServerRegistration } from "apollo-server-fastify"

import { PUBLIC_PATH } from "./paths"

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