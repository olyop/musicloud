import { useEffect } from "react"

import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { QueueNowPlaying } from "../../../types"
import { useResetPlayer } from "../../reset-player"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"
import { updatePlay, useDispatch } from "../../../redux"

export const useNextQueueSong =
	() => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const nextPress = useKeyPress("MediaTrackNext")

		const [ nextQueueSong, result ] =
			useMutation<Data>(NEXT_QUEUE_SONG)

		const handleNextClick =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await nextQueueSong()
					dispatch(updatePlay(true))
				}
			}

		useEffect(() => {
			if (nextPress) {
				void handleNextClick()
			}
		}, [nextPress])

		return [ handleNextClick, result ] as const
	}

interface Data {
	nextQueueSong: QueueNowPlaying,
}