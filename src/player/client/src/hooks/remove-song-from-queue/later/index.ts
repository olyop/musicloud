import { QueueLater } from "../../../types"
import { useMutation } from "../../mutation"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

export const useRemoveSomeFromQueueLater =
	() => {
		const [ removeSomeFromQueueLater, result ] =
			useMutation<Data>(REMOVE_SONG_FROM_QUEUE_LATER)

		const handler =
			() => {
				void removeSomeFromQueueLater()
			}

		return [ handler, result ] as const
	}

interface Data {
	removeSongFromQueueLater: QueueLater,
}