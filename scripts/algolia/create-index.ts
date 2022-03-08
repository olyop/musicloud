import algoliasearch from "algoliasearch"
import { ALGOLIA_OPTIONS } from "@oly_op/musicloud-common"

const client =
	algoliasearch(...ALGOLIA_OPTIONS)

const index =
	client.initIndex(process.env.ALGOLIA_INDEX_NAME)

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
						"user.name",
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
					ranking: [
						"asc(typeName)",
						"desc(plays)",
					],
					attributesForFaceting: [
						"filterOnly(privacy)",
						"searchable(typeName)",
						"filterOnly(user.userID)",
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