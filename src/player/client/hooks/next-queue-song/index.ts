/* eslint-disable prefer-const */
import { useEffect } from "react"
import isEmpty from "lodash/isEmpty"
import { MutationResult } from "@apollo/client"

import { getUserID } from "../../helpers"
import { useMutation } from "../mutation"
import { useKeyPress } from "../key-press"
import { useResetPlayer } from "../reset-player"
import { Handler, Song, User } from "../../types"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"
import { updatePlay, useDispatch } from "../../redux"
import USER_QUEUES_FRAGMENT from "./user-queues-fragment.gql"

interface Data {
	nextQueueSong: User,
}

export const useNextQueueSong =
	() => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const nextPress = useKeyPress("MediaTrackNext")

		const [ nextQueueSong, result ] =
			useMutation<Data>(NEXT_QUEUE_SONG, {
				update: cache => {
					const id =
						cache.identify({
							__typename: "User",
							userID: getUserID(),
						})

					const { nowPlaying, queueNext, queueLater, queuePrevious } =
						cache.readFragment<User>({
							id,
							fragment: USER_QUEUES_FRAGMENT,
						})!

					if (!isEmpty(queueNext) || !isEmpty(queueLater)) {
						let
							newNowPlaying: Song,
							newQueueNext: Song[],
							newQueueLater: Song[],
							newQueuePrevious: Song[]

						newNowPlaying =
							isEmpty(queueNext) ?
								queueLater[0] : queueNext[0]

						if (isEmpty(queueNext)) {
							newQueueLater =
								queueLater.slice(1)
						} else {
							newQueueNext =
								queueNext.slice(1)
						}

						if (isEmpty(queueNext)) {
							newQueueLater =
								queueLater
									.filter(({ queueIndex }) => queueIndex !== 0)
									.map(({ queueIndex, ...song }, index) => ({
										queueIndex: queueIndex! - 1,
										...song,
									}))

							console.log({ newQueueLater })
						} else {
							newQueueNext =
								queueNext
									.filter(({ queueIndex }) => queueIndex !== 0)
									.map(({ queueIndex, ...song }, index) => ({
										queueIndex: queueIndex! - 1,
										...song,
									}))

							console.log({ newQueueNext })
						}

						newQueuePrevious = [
							...queuePrevious,
							{ ...nowPlaying!, queueIndex: queuePrevious.length },
						]

						console.log({ newNowPlaying })
						console.log({ newQueuePrevious })
					}
				},
			})

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
				handleNextClick()
			}
		}, [nextPress])

		return [
			handleNextClick,
			result,
		] as [
			nextQueueSong: Handler,
			result: MutationResult<Data>,
		]
	}