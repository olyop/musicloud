import algoliasearch from "algoliasearch"

const algolia =
	algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID,
		process.env.ALGOLIA_SEARCH_API_KEY,
	)

export default algolia