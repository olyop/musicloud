import { MutationResult } from "@apollo/client"

import { Handler, QueueNowPlaying } from "../../types"

export type UsePlayAlbumResult = [
	playAlbum: Handler,
	isPlaying: boolean,
	result: MutationResult<PlayAlbumData>,
]

export interface PlayAlbumData {
	playAlbum: QueueNowPlaying,
}

export interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}