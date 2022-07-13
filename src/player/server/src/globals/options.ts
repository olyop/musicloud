import { SearchIndex } from "algoliasearch"

import { FastifyPluginOptions } from "../apollo/apollo-server-fastify"

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