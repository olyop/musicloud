import { SongIDBase } from "@oly_op/music-app-common/types"
import { ApolloCache, MutationResult, MutationUpdaterFunction } from "@apollo/client"

import { Handler, QueueNowPlaying } from "../../types"

export type UsePlaySongResult = [
	playSong: Handler,
	isPlaying: boolean,
	result: MutationResult<PlaySongData>,
]

export interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying,
}

export interface PlaySongData {
	playSong: QueueNowPlaying,
}

export type PlaySongUpdate =
	MutationUpdaterFunction<
		PlaySongData,
		SongIDBase,
		unknown,
		ApolloCache<unknown>
	>