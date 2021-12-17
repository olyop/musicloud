import algoliasearch from "algoliasearch"

const client =
	algoliasearch(
		process.env.ALGOLIA_APPLICATION_ID,
		process.env.ALGOLIA_ADMIN_API_KEY,
	)

const index =
	client.initIndex(
		process.env.ALGOLIA_INDEX_NAME,
	)

const main =
	async () => {
		try {
			await index.setSettings({
				hitsPerPage: 20,
				highlightPreTag: "<mark>",
				highlightPostTag: "</mark>",
				attributesToHighlight: [
					"name",
					"text",
				],
				customRanking: [
					"desc(plays)",
				],
				searchableAttributes: [
					"name",
					"text",
					"typeName",
					"description",
				],
				attributesForFaceting: [
					"filterOnly(userID)",
					"filterOnly(privacy)",
					"searchable(typeName)",
				],
			})
			await index.saveSynonyms([{
				type: "synonym",
				synonyms: ["album", "record"],
				objectID: "album-record-synonym",
			},{
				type: "synonym",
				synonyms: ["song", "track"],
				objectID: "song-track-synonym",
			},{
				type: "synonym",
				synonyms: ["remix", "cover", "vs"],
				objectID: "remix-cover-vs-synonym",
			}])
		} catch (error) {
			console.error(error)
		}
	}

void main()