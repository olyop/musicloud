import { loadSchemaSync } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"

const typeDefs =
	loadSchemaSync("./player/server/src/type-defs/*.gql", {
		loaders: [new GraphQLFileLoader()]
	})

export default typeDefs