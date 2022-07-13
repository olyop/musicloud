import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"

import fastify from "../fastify"
import typeDefs from "../type-defs"
import resolvers from "../resolvers"
import createContext from "./create-context"
import { ApolloServer } from "./apollo-server-fastify"

const apollo =
	new ApolloServer({
		typeDefs,
		resolvers,
		cache: "bounded",
		csrfPrevention: false,
		context: createContext(),
		plugins: [
			ApolloServerPluginDrainHttpServer({
				httpServer: fastify.server,
			}),
		],
	})

export default apollo