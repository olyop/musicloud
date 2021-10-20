import { useEffect } from "react"
import { MutationResult } from "@apollo/client"

import { useMutation } from "../mutation"
import { useKeyPress } from "../key-press"
import { Handler, User } from "../../types"
import { useResetPlayer } from "../reset-player"
import { updatePlay, useDispatch } from "../../redux"
import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql"

interface Data {
	previousQueueSong: User,
}

export const usePreviousQueueSong =
	() => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const previousPress = useKeyPress("MediaTrackPrevious")

		const [ previousQueueSong, result ] =
			useMutation<Data>(PREVIOUS_QUEUE_SONG)

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
				handlePreviousClick()
			}
		}, [previousPress])

		return [
			handlePreviousClick,
			result,
		] as [
			previousQueueSong: Handler,
			result: MutationResult<Data>,
		]
	}