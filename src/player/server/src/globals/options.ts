import { SearchIndex } from "algoliasearch"
import { FastifyStaticOptions } from "@fastify/static"

import { PUBLIC_PATH } from "./paths"
import { FastifyPluginOptions } from "../apollo-server-fastify"

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	root: PUBLIC_PATH,
}

export const ALGOLIA_SEARCH_OPTIONS: Parameters<SearchIndex["setSettings"]>[0] = {
	customRanking: ["asc(text)"],
	searchableAttributes: ["ordered(text)"],
	attributesForFaceting: ["filter(privacy)"],
}

export const APOLLO_PLUGIN_OPTIONS: FastifyPluginOptions = {
	cors: false,
	disableHealthCheck: true,
}

export const FASTIFY_LISTEN_OPTIONS = {
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
}