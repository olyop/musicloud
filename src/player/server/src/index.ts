import cors from "@fastify/cors"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import { PG_POOL_OPTIONS } from "@oly_op/musicloud-common"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"

import {
	SERVE_STATIC_OPTIONS,
	FASTIFY_CORS_OPTIONS,
	APOLLO_PLUGIN_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
} from "./globals"

import fastify from "./fastify"
import typeDefs from "./type-defs"
import resolvers from "./resolvers"
import serveClient from "./serve-client"
import createContext from "./create-context"
import { ApolloServer } from "./apollo-server-fastify"

const apollo =
	new ApolloServer({
		typeDefs,
		resolvers,
		cache: "bounded",
		csrfPrevention: true,
		context: createContext(),
		plugins:
			process.env.USE_HTTPS ?
				undefined :
				[ApolloServerPluginDrainHttpServer({ httpServer: fastify.server })],
	})

await apollo.start()

await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(cors, FASTIFY_CORS_OPTIONS)
await fastify.register(compress)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(apollo.plugin, APOLLO_PLUGIN_OPTIONS)
await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)