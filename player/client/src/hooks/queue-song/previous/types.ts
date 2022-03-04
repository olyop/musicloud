import { MutationResult } from "@apollo/client"

import { HandlerPromise, QueueNowPlaying } from "../../../types"

export interface Data {
	previousQueueSong: QueueNowPlaying,
}

export type Result = [
	previousQueueSong: HandlerPromise,
	result: MutationResult<Data>,
]