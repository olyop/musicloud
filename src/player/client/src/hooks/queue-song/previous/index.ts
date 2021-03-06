import { useEffect } from "react"

import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { QueueNowPlaying } from "../../../types"
import { useResetPlayer } from "../../reset-player"
import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql"

export const usePreviousQueueSong =
	() => {
		const resetPlayer = useResetPlayer()
		const previousPress = useKeyPress("MediaTrackPrevious")

		const [ previousQueueSong, result ] =
			useMutation<Data>(PREVIOUS_QUEUE_SONG)

		const handlePreviousClick =
			() => {
				if (!result.loading) {
					resetPlayer()
					void previousQueueSong()
				}
			}

		useEffect(() => {
			if (previousPress) {
				void handlePreviousClick()
			}
		}, [previousPress])

		return [ handlePreviousClick, result ] as const
	}

interface Data {
	previousQueueSong: QueueNowPlaying,
}