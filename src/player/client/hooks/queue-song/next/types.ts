import { MutationResult } from "@apollo/client"

import { HandlerPromise, QueueNowPlaying } from "../../../types"

export interface Data {
	nextQueueSong: QueueNowPlaying,
}

export type Result = [
	nextQueueSong: HandlerPromise,
	result: MutationResult<Data>,
]