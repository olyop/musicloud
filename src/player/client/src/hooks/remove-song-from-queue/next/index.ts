import { QueueNext } from "../../../types";
import { useMutation } from "../../mutation";
import REMOVE_SONG_FROM_QUEUE_NEXT from "./remove-song-from-queue-next.gql";

export const useRemoveSongFromQueueNext = () =>
	useMutation<Data, IndexVars>(REMOVE_SONG_FROM_QUEUE_NEXT);

interface IndexVars {
	index: number;
}

interface Data {
	removeSongFromQueueNext: QueueNext;
}
