import { ApolloCache, MutationUpdaterFunction } from "@apollo/client";

import { QueueNowPlaying, Song, Queue } from "../../types";
import WRITE_QUEUE_NOW_PLAYING from "./write-queue-now-playing.gql";

interface GetQueueData {
	getQueue: QueueNowPlaying;
}

export const updateNowPlayingCache = (cache: ApolloCache<unknown>) => (song: Song) => {
	cache.writeQuery<GetQueueData>({
		query: WRITE_QUEUE_NOW_PLAYING,
		data: {
			getQueue: {
				__typename: "Queue",
				nowPlaying: song,
			},
		},
	});
};

export const updateNowPlayingMutationFunction =
	<Data, Variables, Context>(
		dataToSong: (data: Data) => Queue["nowPlaying"],
	): MutationUpdaterFunction<Data, Variables, Context, ApolloCache<unknown>> =>
	(cache, { data }) => {
		if (data) {
			const song = dataToSong(data);
			if (song) {
				updateNowPlayingCache(cache)(song);
			}
		}
	};
