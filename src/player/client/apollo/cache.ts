import {
	TypePolicies,
	InMemoryCache,
	FieldMergeFunction,
} from "@apollo/client"

import { StoreObject } from "../types"

const mergeArrays =
	(): FieldMergeFunction<StoreObject[]> =>
		(existing = [], incoming = []) =>
			[...existing, ...incoming]

const typePolicies: TypePolicies = {
	Key: {
		keyFields: ["keyID"],
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
	User: {
		keyFields: ["userID"],
		fields: {
			librarySongs: {
				merge: mergeArrays(),
				keyArgs: ["input", ["orderBy"]],
			},
			libraryAlbums: {
				merge: mergeArrays(),
				keyArgs: ["input", ["orderBy"]],
			},
			libraryGenres: {
				merge: mergeArrays(),
				keyArgs: ["input", ["orderBy"]],
			},
			libraryArtists: {
				merge: mergeArrays(),
				keyArgs: ["input", ["orderBy"]],
			},
			libraryPlaylists: {
				merge: mergeArrays(),
				keyArgs: ["input", ["orderBy"]],
			},
		},
	},
}

const cache =
	new InMemoryCache({
		typePolicies,
	})

export default cache