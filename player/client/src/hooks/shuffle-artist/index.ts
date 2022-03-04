import { useEffect } from "react"
import { ArtistID } from "@oly_op/music-app-common/types"

import { useMutation } from "../mutation"
import { QueueNowPlaying } from "../../types"
import { useResetPlayer } from "../reset-player"
import SHUFFLE_ARTIST from "./shuffle-artist.gql"
import { updatePlay, useDispatch } from "../../redux"

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
			() => {
				resetPlayer()
				void shuffleArtist()
			}

		useEffect(() => {
			if (result.data) {
				dispatch(updatePlay(true))
			}
		}, [result.data])

		return [ handleShuffleArtist, result ] as const
	}

interface Data {
	shuffleArtist: QueueNowPlaying,
}