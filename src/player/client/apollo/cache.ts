/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/default-param-last */
import isNull from "lodash/isNull"
import { InMemoryCache, FieldMergeFunction } from "@apollo/client"

import { StoreObject } from "../types"

const mergeArrays =
	(): FieldMergeFunction<StoreObject[] | null> =>
		(existing = [], incoming) => {
			if (isNull(incoming)) {
				return null
			} else if (isNull(existing)) {
				return incoming
			} else {
				return [...existing, ...incoming]
			}
		}

const cache =
	new InMemoryCache({
		typePolicies: {
			Queue: {
				keyFields: [],
			},
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
			},
			Library: {
				keyFields: [],
				fields: {
					songsPaginated: {
						merge: mergeArrays(),
						keyArgs: ["input", ["orderBy"]],
					},
					albumsPaginated: {
						merge: mergeArrays(),
						keyArgs: ["input", ["orderBy"]],
					},
					genresPaginated: {
						merge: mergeArrays(),
						keyArgs: ["input", ["orderBy"]],
					},
					artistsPaginated: {
						merge: mergeArrays(),
						keyArgs: ["input", ["orderBy"]],
					},
					playlistsPaginated: {
						merge: mergeArrays(),
						keyArgs: ["input", ["orderBy"]],
					},
				},
			},
		},
	})

export default cache