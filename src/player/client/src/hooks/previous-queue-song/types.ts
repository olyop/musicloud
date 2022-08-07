import { MutationResult } from "@apollo/client"

import { Handler, QueueNowPlaying } from "../../types"

export interface Data {
	previousQueueSong: QueueNowPlaying,
}

export type Result = [
	previousQueueSong: Handler,
	result: MutationResult<Data>,
]