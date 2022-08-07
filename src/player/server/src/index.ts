/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"
import { readFile } from "node:fs/promises"
import { ApolloServer } from "@apollo/server"
import { fastifyApolloHandler } from "@oly_op/apollo-server-fastify"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { createFastifyCORSOptions } from "@oly_op/musicloud-common/build/create-fastify-cors-options"
import { FASTIFY_HELMET_OPTIONS, PG_POOL_OPTIONS } from "@oly_op/musicloud-common/build/server-options"
import { createFastifyServerOptions } from "@oly_op/musicloud-common/build/create-fastify-server-options"

import { Context } from "./types"
import typeDefs from "./type-defs"
import resolvers from "./resolvers"
import serveClient from "./serve-client"
import createContext from "./create-context"
import { FASTIFY_STATIC_OPTIONS, FASTIFY_LISTEN_OPTIONS } from "./globals"

const apollo =
	new ApolloServer<Context>({
		typeDefs,
		resolvers,
	})

const fastify =
	Fastify(createFastifyServerOptions({
		cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
		key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
	}))

await apollo.start()

await fastify.register(rateLimit)
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS)
await fastify.register(cors, createFastifyCORSOptions({ service: ServicesNames.PLAYER }))
await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(compress)
await fastify.register(serveStatic, FASTIFY_STATIC_OPTIONS)

fastify.route({
	url: "/graphql",
	method: ["GET", "POST"],
	handler: fastifyApolloHandler(apollo, {
		context: createContext(),
	}),
})

await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)