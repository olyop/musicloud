import { MutationResult } from "@apollo/client"

import { useMutation } from "../../mutation"
import { Handler, QueueLater } from "../../../types"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

export const useRemoveSomeFromQueueLater =
	(): Return => {
		const [ removeSomeFromQueueLater, result ] =
			useMutation<RemoveLaterData>(REMOVE_SONG_FROM_QUEUE_LATER)

		const handler =
			async () => {
				await removeSomeFromQueueLater()
			}

		return [ handler, result ]
	}

type Return = [
	removeSomeFromQueueLater: Handler,
	result: MutationResult<RemoveLaterData>,
]

interface RemoveLaterData {
	removeSongFromQueueLater: QueueLater,
}