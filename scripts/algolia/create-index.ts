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
			console.log(
				await index.setSettings({
					hitsPerPage: 20,
					highlightPreTag: "<mark>",
					highlightPostTag: "</mark>",
					searchableAttributes: [
						"name, title",
						"album.title",
						"artists.name, remixers.name, featuring.name",
						"genres.name",
						"city",
						"country",
					],
					attributesToHighlight: [
						"name",
						"title",
						"album.title",
						"genres.name",
						"artists.name",
						"remixers.name",
						"featuring.name",
						"city",
						"country",
					],
					customRanking: [
						"desc(plays)",
					],
					attributesForFaceting: [
						"filterOnly(userID)",
						"filterOnly(privacy)",
						"searchable(typeName)",
					],
				}),
			)
			console.log(
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
				}]),
			)
		} catch (error) {
			console.error(error)
		}
	}

void main()