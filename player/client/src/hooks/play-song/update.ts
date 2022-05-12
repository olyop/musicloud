import { ApolloCache, Reference } from "@apollo/client"
import { SongID } from "@oly_op/musicloud-common"
import { Modifier } from "@apollo/client/cache/core/types/common"

import { MutationUpdaterFunction } from "./types"

const queueNowPlayingModifer =
	({ songID }: SongID): Modifier<Reference> =>
		(value, { toReference }) =>
			toReference({
				songID,
				__typename: "Song",
			})!

export const updateNowPlayingCache =
	(cache: ApolloCache<unknown>) =>
		({ songID }: SongID) => {
			cache.modify({
				id: cache.identify({ __typename: "Queue" }),
				fields: {
					nowPlaying: queueNowPlayingModifer({ songID }),
				},
			})
		}

const updatePlaysTotalCache =
	(cache: ApolloCache<unknown>) =>
		({ songID }: SongID) =>
			cache.modify({
				id: cache.identify({ songID, __typename: "Song" }),
				fields: {
					playsTotal:
						(cached: number) =>
							cached + 1,
				},
			})

export const mutationUpdater: MutationUpdaterFunction =
	({ isOptimistic, toggleIsOptimistic }) =>
		(cache, result) => {
			const { data } = result
			if (data?.playSong.nowPlaying) {
				const song = data.playSong.nowPlaying
				updateNowPlayingCache(cache)(song)
				if (isOptimistic) {
					toggleIsOptimistic(false)
					updatePlaysTotalCache(cache)(song)
				} else {
					toggleIsOptimistic(true)
				}
			}
		}