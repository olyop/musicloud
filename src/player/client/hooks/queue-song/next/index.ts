import { useEffect } from "react"
import isNull from "lodash/isNull"
import isEmpty from "lodash/isEmpty"
import { useApolloClient, ApolloClient, MutationResult } from "@apollo/client"

import { useUserID } from "../../user-id"
import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { User, Handler } from "../../../types"
import { useResetPlayer } from "../../reset-player"
import NEXT_QUEUE_SONG from "./next-queue-song.gql"
import { updatePlay, useDispatch } from "../../../redux"
import USER_QUEUES_FRAGMENT from "../user-queues-fragment.gql"

interface Data {
	nextQueueSong: Partial<User>,
}

const createOptimisticResponse =
	(userID: string, client: ApolloClient<unknown>): Data => {
		const id =
			client.cache.identify({ userID, __typename: "User" })

		const data =
			client.readFragment<Partial<User>>({
				id,
				fragment: USER_QUEUES_FRAGMENT,
			})

		if (!isNull(data)) {
			const { queuePrevious, nowPlaying, queueNext, queueLater } =
				data

			const isQueueNextEmpty =
				isEmpty(queueNext)

			const queueToBeEdited =
				isQueueNextEmpty ?
					queueLater : queueNext

			const queueNotToBeEdited =
				isQueueNextEmpty ?
					queueNext : queueLater

			const queueToBeEditedName =
				isQueueNextEmpty ?
					"queueLater" : "queueNext"

			const queueNotToBeEditedName =
				isQueueNextEmpty ?
					"queueNext" : "queueLater"

			if (!isEmpty(queueNext) || !isEmpty(queueLater)) {
				return {
					nextQueueSong: {
						userID,
						nowPlaying:
							queueToBeEdited![0],
						queuePrevious: [ ...queuePrevious!, {
							...nowPlaying!,
							queueIndex: queuePrevious!.length,
						}],
						[queueNotToBeEditedName]:
							queueNotToBeEdited,
						[queueToBeEditedName]:
							queueToBeEdited!
								.slice(1)
								.filter(({ queueIndex }) => (
									queueIndex !== 0
								))
								.map(({ queueIndex, ...song }) => ({
									queueIndex: queueIndex! - 1,
									...song,
								})),
					},
				}
			} else {
				return {
					nextQueueSong: {
						userID,
					},
				}
			}
		} else {
			return {
				nextQueueSong: {
					userID,
				},
			}
		}
	}

export const useNextQueueSong =
	() => {
		const userID = useUserID()
		const dispatch = useDispatch()
		const client = useApolloClient()
		const resetPlayer = useResetPlayer()
		const nextPress = useKeyPress("MediaTrackNext")

		console.log(
			client.readFragment<Partial<User>>({
				fragment: USER_QUEUES_FRAGMENT,
				id: client.cache.identify({ userID, __typename: "User" }),
			}),
		)

		const [ nextQueueSong, result ] =
			useMutation<Data>(NEXT_QUEUE_SONG, {
				optimisticResponse: createOptimisticResponse(userID, client),
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