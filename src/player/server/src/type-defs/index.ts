import path from "node:path"
import { fileURLToPath } from "node:url"
import { loadSchema } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"

const directoryName =
	path.dirname(fileURLToPath(import.meta.url))

const typeDefs =
	await loadSchema(path.join(directoryName, "*.gql"), {
		loaders: [new GraphQLFileLoader()],
	})

export default typeDefs