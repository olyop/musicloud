import { MutationResult } from "@apollo/client"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"
import { useDispatch, updatePlay } from "../../redux"
import { Handler, QueueNowPlaying } from "../../types"

export const useShuffleArtist =
	({ artistID }: ArtistIDBase) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<ShuffleArtistData, ArtistIDBase>(
				SHUFFLE_ARTIST,
				{ variables: { artistID } },
			)

		const handleShuffleArtist =
			async () => {
				resetPlayer()
				await shuffleArtist()
				dispatch(updatePlay(true))
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