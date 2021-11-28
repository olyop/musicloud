import { MutationResult } from "@apollo/client"

import { useMutation } from "../../mutation"
import { Handler, QueueNext } from "../../../types"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"

export const useRemoveSomeFromQueueNext =
	(): Return => {
		const [ removeSomeFromQueueNext, result ] =
			useMutation<Data>(REMOVE_SONG_FROM_QUEUE_NEXT)

		const handler =
			async () => {
				await removeSomeFromQueueNext()
			}

		return [ handler, result ]
	}

type Return = [
	removeSomeFromQueueLater: Handler,
	result: MutationResult<Data>,
]

interface Data {
	removeSongFromQueueNext: QueueNext,
}