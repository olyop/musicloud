import { QueueLater } from "../../../types"
import { useMutation } from "../../mutation"
import REMOVE_SONG_FROM_QUEUE_LATER from "./remove-song-from-queue-later.gql"

export const useRemoveSongFromQueueLater =
	() => useMutation<Data, IndexVars>(REMOVE_SONG_FROM_QUEUE_LATER)

interface IndexVars {
	index: number,
}

interface Data {
	removeSongFromQueueLater: QueueLater,
}