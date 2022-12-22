import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";

const typeDefs = await loadSchema(new URL("*.gql", import.meta.url).pathname, {
	loaders: [new GraphQLFileLoader()],
});

export default typeDefs;
