import path from "node:path"
import { loadSchema } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { fileURLToPath } from "node:url"

const directoryName =
	path.dirname(fileURLToPath(import.meta.url))

const typeDefs =
	await loadSchema(path.join(directoryName, "*.gql"), {
		loaders: [new GraphQLFileLoader()],
	})

export default typeDefs