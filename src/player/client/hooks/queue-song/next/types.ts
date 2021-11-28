import { MutationResult } from "@apollo/client"

import { Handler, QueueNowPlaying } from "../../../types"

export interface NextQueueSongData {
	nextQueueSong: QueueNowPlaying,
}

export type UseNextQueueSongResult = [
	nextQueueSong: Handler,
	result: MutationResult<NextQueueSongData>,
]