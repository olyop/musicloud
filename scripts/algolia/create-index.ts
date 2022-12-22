import { ALGOLIA_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import algoliasearch from "algoliasearch";

const client = algoliasearch(...ALGOLIA_OPTIONS);
const index = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);

console.log("Saving search index settings...");

const settingsResponse = await index.setSettings({
	hitsPerPage: 20,
	highlightPreTag: "<mark>",
	highlightPostTag: "</mark>",
	searchableAttributes: [
		"user.name",
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
	ranking: ["asc(typeName)", "desc(plays)"],
	attributesForFaceting: ["filterOnly(privacy)", "searchable(typeName)", "filterOnly(user.userID)"],
});

console.log("Saving search synonyms...");

const synonymsResponse = await index.saveSynonyms([
	{
		type: "synonym",
		synonyms: ["album", "record"],
		objectID: "album-record-synonym",
	},
	{
		type: "synonym",
		synonyms: ["song", "track"],
		objectID: "song-track-synonym",
	},
	{
		type: "synonym",
		synonyms: ["remix", "cover", "vs"],
		objectID: "remix-cover-vs-synonym",
	},
]);

console.log(
	JSON.stringify(
		{
			settingsResponse,
			synonymsResponse,
		},
		null,
		2,
	),
);
