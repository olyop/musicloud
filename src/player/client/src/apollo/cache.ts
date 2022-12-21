import { FieldMergeFunction, InMemoryCache } from "@apollo/client";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import isEmpty from "lodash-es/isEmpty";
import isNull from "lodash-es/isNull";

const mergePossibleNullValue: FieldMergeFunction<unknown | null> = (existing, incoming) => {
	if (isNull(incoming) || isEmpty(incoming)) {
		return null;
	} else {
		return incoming;
	}
};

const mergeObjects: FieldMergeFunction<Record<string, unknown>> = (existing, incoming) => ({
	...(isNull(existing) ? {} : existing),
	...(isNull(incoming) ? {} : incoming),
});

const cache = new InMemoryCache({
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
});

const cachePersistor = new CachePersistor({
	cache,
	maxSize: false,
	storage: new LocalStorageWrapper(localStorage),
});

await cachePersistor.restore();

export { cache, cachePersistor };
