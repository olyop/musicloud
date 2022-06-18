import { ApolloServer } from "./apollo-server-fastify"

import typeDefs from "./type-defs"
import resolvers from "./resolvers"
import createContext from "./create-context"

const apollo =
	new ApolloServer({
		typeDefs,
		resolvers,
		context: createContext(),
	})

export default apollo