import algoliasearch from "algoliasearch"

const client =
	algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID,
		process.env.ALGOLIA_ADMIN_API_KEY,
	)

const main =
	() => {
		try {
			console.log(
				client.generateSecuredApiKey(
					process.env.ALGOLIA_SEARCH_API_KEY,
					{ filters: "NOT privacy:PRIVATE" },
				),
			)
		} catch (error) {
			console.error(error)
		}
	}

void main()