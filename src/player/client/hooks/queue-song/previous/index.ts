import { useEffect } from "react"

import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { useResetPlayer } from "../../reset-player"
import { updatePlay, useDispatch } from "../../../redux"
import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql"
import { PreviousQueueSongData, UsePreviousQueueSongResult } from "./types"

export const usePreviousQueueSong =
	(): UsePreviousQueueSongResult => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const previousPress = useKeyPress("MediaTrackPrevious")

		const [ previousQueueSong, result ] =
			useMutation<PreviousQueueSongData>(PREVIOUS_QUEUE_SONG)

		const handlePreviousClick =
			async () => {
				if (!result.loading) {
					resetPlayer()
					await previousQueueSong()
					dispatch(updatePlay(true))
				}
			}

		useEffect(() => {
			if (previousPress) {
				void handlePreviousClick()
			}
		}, [previousPress])

		return [ handlePreviousClick, result ]
	}