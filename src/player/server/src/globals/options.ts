import { SearchIndex } from "algoliasearch"
import { FastifyListenOptions } from "fastify"
import { FastifyStaticOptions } from "@fastify/static"
import { FastifyHelmetOptions } from "@fastify/helmet"

import {
	FASTIFY_HELMET_OPTIONS as FASTIFY_HELMET_BASE_OPTIONS,
	FASTIFY_STATIC_OPTIONS as FASTIFY_STATIC_BASE_OPTIONS,
} from "@oly_op/musicloud-common/build/server-options"

export const FASTIFY_HELMET_OPTIONS: FastifyHelmetOptions = {
	...FASTIFY_HELMET_BASE_OPTIONS,
}

export const ALGOLIA_SEARCH_OPTIONS: Parameters<SearchIndex["setSettings"]>[0] = {
	customRanking: ["asc(text)"],
	searchableAttributes: ["ordered(text)"],
	attributesForFaceting: ["filter(privacy)"],
}

export const FASTIFY_STATIC_OPTIONS: FastifyStaticOptions = {
	...FASTIFY_STATIC_BASE_OPTIONS,
	root: new URL("../public", import.meta.url).pathname,
}

export const FASTIFY_LISTEN_OPTIONS: FastifyListenOptions = {
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
}