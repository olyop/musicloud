import algoliasearch from "algoliasearch"

export const algolia =
	algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID,
		process.env.ALGOLIA_SEARCH_API_KEY,
	)

export const searchIndex =
	algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)