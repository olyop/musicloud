import { ApolloClient } from "@apollo/client"

import link from "./link"
import cache from "./cache"

const apollo =
	new ApolloClient({
		link,
		cache,
	})

export { link, cache }

export default apollo