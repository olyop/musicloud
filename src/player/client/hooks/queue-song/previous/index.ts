import { useEffect } from "react"
import isNull from "lodash/isNull"
import isEmpty from "lodash/isEmpty"
import { ApolloCache, MutationResult } from "@apollo/client"

import { useUserID } from "../../user-id"
import { useMutation } from "../../mutation"
import { useKeyPress } from "../../key-press"
import { User, Handler } from "../../../types"
import { useResetPlayer } from "../../reset-player"
import { updatePlay, useDispatch } from "../../../redux"
import PREVIOUS_QUEUE_SONG from "./previous-queue-song.gql"
import USER_QUEUES_FRAGMENT from "../user-queues-fragment.gql"

interface Data {
	npreviousQueueSong: User,
}

const updateFunction =
	(userID: string) =>
		(cache: ApolloCache<unknown>) => {
			// const id =
			// 	cache.identify({ userID, __typename: "User" })

			// const data =
			// 	cache.readFragment<Partial<User>>({
			// 		id,
			// 		fragment: USER_QUEUES_FRAGMENT,
			// 	})

			// if (!isNull(data)) {
			// 	const { queuePrevious, nowPlaying, queueNext, queueLater } =
			// 		data

			// 	const isQueueNextEmpty =
			// 		isEmpty(queueNext)

			// 	const queueToBeEdited =
			// 		isQueueNextEmpty ?
			// 			queueNext : queueLater

			// 	const queueNotToBeEdited =
			// 		isQueueNextEmpty ?
			// 			queueLater : queueNext

			// 	const queueToBeEditedName =
			// 		isQueueNextEmpty ?
			// 			"queueLater" : "queueNext"

			// 	const queueNotToBeEditedName =
			// 		isQueueNextEmpty ?
			// 			"queueNext" : "queueLater"

			// 	if (!isEmpty(queueNext) || !isEmpty(queueLater)) {
			// 		cache.writeFragment<Partial<User>>({
			// 			id,
			// 			fragment: USER_QUEUES_FRAGMENT,
			// 			data: {
			// 				userID,
			// 				nowPlaying: queueToBeEdited![0],
			// 				queuePrevious: [
			// 					...queuePrevious!,
			// 					{ ...nowPlaying!, queueIndex: queuePrevious!.length },
			// 				],
			// 				[queueNotToBeEditedName]:
			// 					queueNotToBeEdited,
			// 				[queueToBeEditedName]:
			// 					queueToBeEdited!
			// 						.slice(1)
			// 						.filter(({ queueIndex }) => (
			// 							queueIndex !== 0
			// 						))
			// 						.map(({ queueIndex, ...song }) => ({
			// 							queueIndex: queueIndex! - 1,
			// 							...song,
			// 						})),
			// 			},
			// 		})
			// 	}
			// }
		}

export const usePreviousQueueSong =
	() => {
		const userID = useUserID()
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()
		const previousPress = useKeyPress("MediaTrackPrevious")

		const [ previousQueueSong, result ] =
			useMutation<Data>(PREVIOUS_QUEUE_SONG, {
				// update: updateFunction(userID),
			})

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