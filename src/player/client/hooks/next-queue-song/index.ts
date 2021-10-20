/* eslint-disable prefer-const */
import { useEffect } from "react"
import isNull from "lodash/isNull"
import isEmpty from "lodash/isEmpty"
import { ApolloCache, MutationResult } from "@apollo/client"

import { getUserID } from "../../helpers"
import { useMutation } from "../mutation"
import { useKeyPress } from "../key-press"
import { Handler, User } from "../../types"
import { useResetPlayer } from "../reset-player"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"
import { updatePlay, useDispatch } from "../../redux"
import USER_QUEUES_FRAGMENT from "./user-queues-fragment.gql"
import USER_QUEUE_NEXT_FRAGMENT from "./user-queue-next-fragment.gql"
import USER_QUEUE_LATER_FRAGMENT from "./user-queue-later-fragment.gql"
import USER_QUEUE_PREVIOUS_FRAGMENT from "./user-queue-previous-fragment.gql"
import USER_QUEUE_NOW_PLAYING_FRAGMENT from "./user-now-playing-fragment.gql"

interface Data {
	nextQueueSong: User,
}

const update =
	(cache: ApolloCache<unknown>) => {
		const userID =
			getUserID()

		const id =
			cache.identify({ userID, __typename: "User" })

		const data =
			cache.readFragment<User>({
				id,
				fragment: USER_QUEUES_FRAGMENT,
			})

		if (!isNull(data)) {
			const { nowPlaying, queueNext, queueLater, queuePrevious } =
				data
			if (!isEmpty(queueNext) || !isEmpty(queueLater)) {
				cache.writeFragment<Partial<User>>({
					id,
					fragment: USER_QUEUE_NOW_PLAYING_FRAGMENT,
					data: {
						userID,
						nowPlaying:
							isEmpty(queueNext) ?
								queueLater[0] :
								queueNext[0],
					},
				})
				if (isEmpty(queueNext)) {
					cache.writeFragment<Partial<User>>({
						id,
						fragment: USER_QUEUE_LATER_FRAGMENT,
						data: {
							userID,
							queueLater:
								queueLater
									.slice(1)
									.filter(({ queueIndex }) => (
										queueIndex !== 0
									))
									.map(({ queueIndex, ...song }) => ({
										queueIndex: queueIndex! - 1,
										...song,
									})),
						},
					})
				} else {
					cache.writeFragment<Partial<User>>({
						id,
						fragment: USER_QUEUE_NEXT_FRAGMENT,
						data: {
							userID,
							queueNext:
								queueNext
									.slice(1)
									.filter(({ queueIndex }) => (
										queueIndex !== 0
									))
									.map(({ queueIndex, ...song }) => ({
										queueIndex: queueIndex! - 1,
										...song,
									})),
						},
					})
				}
				cache.writeFragment<Partial<User>>({
					id,
					fragment: USER_QUEUE_PREVIOUS_FRAGMENT,
					data: {
						userID,
						queuePrevious: [
							...queuePrevious,
							{ ...nowPlaying!, queueIndex: queuePrevious.length },
						],
					},
				})
			}
		}
	}

export const useNextQueueSong =
	() => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const nextPress = useKeyPress("MediaTrackNext")

		const [ nextQueueSong, result ] =
			useMutation<Data>(NEXT_QUEUE_SONG, { update })

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