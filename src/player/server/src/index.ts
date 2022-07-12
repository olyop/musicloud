import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import { createFastifyCORSOptions, HELMET_OPTIONS, PG_POOL_OPTIONS } from "@oly_op/musicloud-common"

import {
	FASTIFY_STATIC_OPTIONS,
	APOLLO_PLUGIN_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
} from "./globals"

import fastify from "./fastify"
import typeDefs from "./type-defs"
import resolvers from "./resolvers"
import createContext from "./create-context"
import { ApolloServer } from "./apollo-server-fastify"

const apollo =
	new ApolloServer({
		typeDefs,
		resolvers,
		cache: "bounded",
		csrfPrevention: true,
		context: createContext(),
		plugins: [
			ApolloServerPluginDrainHttpServer({
				httpServer: fastify.server,
			}),
		],
	})

await apollo.start()

await fastify.register(rateLimit)
await fastify.register(helmet, HELMET_OPTIONS)
await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(cors, createFastifyCORSOptions({ service: "player" }))
await fastify.register(compress)
await fastify.register(serveStatic, FASTIFY_STATIC_OPTIONS)
await fastify.register(apollo.plugin, APOLLO_PLUGIN_OPTIONS)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)