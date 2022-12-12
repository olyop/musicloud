import {
	ApolloClient,
	NormalizedCacheObject,
	useApolloClient as useBaseApolloClient,
} from "@apollo/client";

import { cache, cachePersistor } from "./cache";
import link from "./link";

const apollo = new ApolloClient({
	link,
	cache,
});

const useApolloClient = () => useBaseApolloClient() as ApolloClient<NormalizedCacheObject>;

export { useApolloClient, cachePersistor };

export default apollo;
