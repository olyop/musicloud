import { MutationResult } from "@apollo/client"
import { ArtistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"
import { Handler, QueueNowPlaying } from "../../types"

export const useShuffleArtist =
	({ artistID }: ArtistID) => {
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<ShuffleArtistData, ArtistID>(
				SHUFFLE_ARTIST,
				{ variables: { artistID } },
			)

		const handleShuffleArtist =
			async () => {
				resetPlayer()
				await shuffleArtist()
			}

		return [ handleShuffleArtist, result ] as UseShuffleArtistResult
	}

type UseShuffleArtistResult = [
	shuffleArtist: Handler,
	result: MutationResult<ShuffleArtistData>,
]

interface ShuffleArtistData {
	shuffleArtist: QueueNowPlaying,
}