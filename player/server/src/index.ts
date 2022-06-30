import cors from "@fastify/cors"
import createFastify from "fastify"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import { PG_POOL_OPTIONS, FASTIFY_SERVER_OPTIONS } from "@oly_op/musicloud-common"

import typeDefs from "./type-defs"
import resolvers from "./resolvers"
import serveClient from "./serve-client"
import createContext from "./create-context"
import { ApolloServer } from "./apollo-server-fastify"
import { preValidationHook, multiPartContentTypeParser } from "./fastify-hooks"
import { SERVE_STATIC_OPTIONS, FASTIFY_CORS_OPTIONS, APOLLO_PLUGIN_OPTIONS } from "./globals"

const fastify =
	createFastify(FASTIFY_SERVER_OPTIONS)

const apollo =
	new ApolloServer({
		typeDefs,
		resolvers,
		cache: "bounded",
		csrfPrevention: false,
		context: createContext(),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer: fastify.server })],
	})

await apollo.start()

fastify.addContentTypeParser("multipart/form-data", multiPartContentTypeParser)
fastify.addHook("preValidation", preValidationHook)

await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(cors, FASTIFY_CORS_OPTIONS)
await fastify.register(compress)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(apollo.plugin, APOLLO_PLUGIN_OPTIONS)
await fastify.register(serveClient)

await fastify.listen({
	host: process.env.HOST,
	port: parseInt(process.env.PLAYER_SERVER_PORT),
})