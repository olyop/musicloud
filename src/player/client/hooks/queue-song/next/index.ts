import { useEffect } from "react"

import { Data, Result } from "./types"
import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { useResetPlayer } from "../../reset-player"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"

export const useNextQueueSong =
	(): Result => {
		const resetPlayer = useResetPlayer()
		const nextPress = useKeyPress("MediaTrackNext")

		const [ nextQueueSong, result ] =
			useMutation<Data>(NEXT_QUEUE_SONG)

		const handleNextClick =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await nextQueueSong()
				}
			}

		useEffect(() => {
			if (nextPress) {
				void handleNextClick()
			}
		}, [nextPress])

		return [ handleNextClick, result ]
	}