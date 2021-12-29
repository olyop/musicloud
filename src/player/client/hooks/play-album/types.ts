import { MutationResult } from "@apollo/client"

import { HandlerPromise, QueueNowPlaying } from "../../types"

export type UsePlayAlbumResult = [
	playAlbum: HandlerPromise,
	isPlaying: boolean,
	result: MutationResult<PlayAlbumData>,
]

export interface PlayAlbumData {
	playAlbum: QueueNowPlaying,
}

export interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}