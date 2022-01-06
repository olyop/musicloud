import algoliasearch from "algoliasearch"

const ADMIN_API_KEY =
	process.argv[2]!

const client =
	algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID,
		ADMIN_API_KEY,
	)

const main =
	() => {
		try {
			console.log(
				client.generateSecuredApiKey(
					ADMIN_API_KEY,
					{ filters: "NOT privacy:PRIVATE" },
				),
			)
		} catch (error) {
			console.error(error)
		}
	}

void main()