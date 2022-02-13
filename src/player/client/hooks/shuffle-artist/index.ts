import { MutationResult } from "@apollo/client"
import { ArtistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"
import { updatePlay, useDispatch } from "../../redux"
import { HandlerPromise, QueueNowPlaying } from "../../types"

export const useShuffleArtist =
	({ artistID }: ArtistID) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ shuffleArtist, result ] =
			useMutation<Data, ArtistID>(
				SHUFFLE_ARTIST,
				{ variables: { artistID } },
			)

		const handleShuffleArtist =
			async () => {
				resetPlayer()
				await shuffleArtist()
				dispatch(updatePlay(true))
			}

		return [ handleShuffleArtist, result ] as Result
	}

interface Data {
	shuffleArtist: QueueNowPlaying,
}

type Result = [
	shuffleArtist: HandlerPromise,
	result: MutationResult<Data>,
]