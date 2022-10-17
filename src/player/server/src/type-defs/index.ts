import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const typeDefs = await loadSchema(new URL("*.gql", import.meta.url).pathname, {
	loaders: [new GraphQLFileLoader()],
});

export default typeDefs;
