import { ArtistID } from "@oly_op/musicloud-common/build/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import { updateNowPlayingCache } from "../../helpers"

import SHUFFLE_ARTIST from "./shuffle-artist.gql"

export const useShuffleArtist =
	({ artistID }: ArtistID) => {
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<Data, ArtistID>(SHUFFLE_ARTIST, {
				variables: { artistID },
				update: (cache, { data }) => {
					if (data?.shuffleArtist.nowPlaying) {
						updateNowPlayingCache(cache)(data.shuffleArtist.nowPlaying)
					}
				},
			})

		const handler =
			() => {
				resetPlayer()
				void shuffleArtist()
			}

		return [ handler, result ] as const
	}

interface Data {
	shuffleArtist: QueueNowPlaying,
}