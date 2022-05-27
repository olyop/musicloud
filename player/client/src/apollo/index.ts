import { useApolloClient as useBaseApolloClient, ApolloClient, NormalizedCacheObject } from "@apollo/client"

import link from "./link"
import cache from "./cache"

const apollo =
	new ApolloClient({
		link,
		cache,
	})

const useApolloClient =
	() => useBaseApolloClient() as ApolloClient<NormalizedCacheObject>

export {
	link,
	cache,
	useApolloClient,
}

export default apollo