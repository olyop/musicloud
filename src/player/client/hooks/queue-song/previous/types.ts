import { MutationResult } from "@apollo/client"

import { Handler, QueueNowPlaying } from "../../../types"

export interface PreviousQueueSongData {
	previousQueueSong: QueueNowPlaying,
}

export type UsePreviousQueueSongResult = [
	previousQueueSong: Handler,
	result: MutationResult<PreviousQueueSongData>,
]