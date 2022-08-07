import { ApolloCache } from "@apollo/client"

import { QueueNowPlaying, Song } from "../../types"
import WRITE_QUEUE_NOW_PLAYING from "./write-queue-now-playing.gql"

interface Data {
	getQueue: QueueNowPlaying,
}

export const updateNowPlayingCache =
	(cache: ApolloCache<unknown>) =>
		(song: Song) => {
			cache.writeQuery<Data>({
				query: WRITE_QUEUE_NOW_PLAYING,
				data: {
					getQueue: {
						__typename: "Queue",
						nowPlaying: song,
					},
				},
			})
		}