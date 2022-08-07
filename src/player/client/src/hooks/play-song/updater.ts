import { SongID } from "@oly_op/musicloud-common/build/types"
import { ApolloCache } from "@apollo/client"

import { Updater } from "./types"
import { updateNowPlayingCache } from "../../helpers"

const updatePlaysTotalCache =
	(cache: ApolloCache<unknown>) =>
		({ songID }: SongID) => {
			cache.modify({
				id: cache.identify({ songID, __typename: "Song" }),
				fields: {
					playsTotal: (cached: number) => cached + 1,
				},
			})
		}

export const updater: Updater =
	(isOptimistic, updateIsOptimistic) =>	(cache, result) => {
		if (result.data?.playSong.nowPlaying) {
			const song = result.data.playSong.nowPlaying
			updateNowPlayingCache(cache)(song)
			if (isOptimistic) {
				updatePlaysTotalCache(cache)(song)
				updateIsOptimistic(false)
			} else {
				updateIsOptimistic(true)
			}
		}
	}