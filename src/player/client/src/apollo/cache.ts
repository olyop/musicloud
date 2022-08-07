import isNull from "lodash-es/isNull"
// import localForage from "localforage"
import { FieldMergeFunction, InMemoryCache } from "@apollo/client"
// import { persistCache, LocalForageWrapper } from "apollo3-cache-persist"

const mergePossibleNullValue: FieldMergeFunction<unknown | null> =
	(existing, incoming) => {
		if (isNull(incoming)) {
			return null
		} else {
			return incoming
		}
	}

const mergeObjects: FieldMergeFunction<Record<string, unknown>> =
	(existing, incoming) => ({
		...existing,
		...incoming,
	})

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
						merge: mergePossibleNullValue,
					},
				},
			},
			Library: {
				keyFields: false,
				merge: mergeObjects,
			},
			Queue: {
				keyFields: false,
				merge: mergeObjects,
				fields: {
					next: {
						merge: mergePossibleNullValue,
					},
					later: {
						merge: mergePossibleNullValue,
					},
					previous: {
						merge: mergePossibleNullValue,
					},
					nowPlaying: {
						merge: mergePossibleNullValue,
					},
				},
			},
		},
	})

// await persistCache({
// 	cache,
// 	storage: new LocalForageWrapper(localForage),
// })

export default cache