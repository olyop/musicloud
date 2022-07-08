import { QueueNext } from "../../../types"
import { useMutation } from "../../mutation"
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql"

export const useRemoveSomeFromQueueNext =
	() => {
		const [ removeSomeFromQueueNext, result ] =
			useMutation<Data>(REMOVE_SONG_FROM_QUEUE_NEXT)

		const handler =
			() => {
				void removeSomeFromQueueNext()
			}

		return [ handler, result ]
	}

interface Data {
	removeSongFromQueueNext: QueueNext,
}