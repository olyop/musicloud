import { MutationResult } from "@apollo/client"

import { useMutation } from "../../mutation"
import { HandlerPromise, QueueLater } from "../../../types"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

export const useRemoveSomeFromQueueLater =
	(): Return => {
		const [ removeSomeFromQueueLater, result ] =
			useMutation<Data>(REMOVE_SONG_FROM_QUEUE_LATER)

		const handler =
			async () => {
				await removeSomeFromQueueLater()
			}

		return [ handler, result ]
	}

interface Data {
	removeSongFromQueueLater: QueueLater,
}

type Return = [
	removeSomeFromQueueLater: HandlerPromise,
	result: MutationResult<Data>,
]