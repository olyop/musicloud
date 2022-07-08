import { isNull } from "lodash-es"
import localForage from "localforage"
import { concatPagination } from "@apollo/client/utilities"
import { FieldMergeFunction, InMemoryCache } from "@apollo/client"
import { persistCache, LocalForageWrapper } from "apollo3-cache-persist"

const replacePossibleNullArray: FieldMergeFunction<unknown[] | null> =
	(existing, incoming) => {
		if (isNull(incoming)) {
			return null
		} else {
			return incoming
		}
	}

const cache =
	new InMemoryCache({
		typePolicies: {
			Key: {
				keyFields: ["keyID"],
			},
			User: {
				keyFields: ["userID"],
			},
			Song: {
				keyFields: ["songID"],
			},
			Play: {
				keyFields: ["playID"],
			},
			Album: {
				keyFields: ["albumID"],
			},
			Genre: {
				keyFields: ["genreID"],
			},
			Artist: {
				keyFields: ["artistID"],
			},
			Playlist: {
				keyFields: ["playlistID"],
				fields: {
					songs: {
						merge: replacePossibleNullArray,
					},
				},
			},
			Queue: {
				keyFields: [],
				fields: {
					next: {
						merge: replacePossibleNullArray,
					},
					later: {
						merge: replacePossibleNullArray,
					},
					previous: {
						merge: replacePossibleNullArray,
					},
				},
			},
			Library: {
				keyFields: [],
				fields: {
					songsPaginated: concatPagination(["input", ["orderBy"]]),
					albumsPaginated: concatPagination(["input", ["orderBy"]]),
					genresPaginated: concatPagination(["input", ["orderBy"]]),
					artistsPaginated: concatPagination(["input", ["orderBy"]]),
					playlistsPaginated: concatPagination(["input", ["orderBy"]]),
				},
			},
		},
	})

await persistCache({
	cache,
	storage: new LocalForageWrapper(localForage),
})

export default cache