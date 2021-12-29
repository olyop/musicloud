import { SongID } from "@oly_op/music-app-common/types"
import { ApolloCache, MutationResult, MutationUpdaterFunction } from "@apollo/client"

import { HandlerPromise, QueueNowPlaying, Song } from "../../types"

export type Input =
	Song | SongID

export type Result = [
	playSong: HandlerPromise,
	isPlaying: boolean,
	result: MutationResult<Data>,
]

export interface QueryData {
	getQueue: QueueNowPlaying,
}

export interface Data {
	playSong: QueueNowPlaying,
}

export type Update =
	MutationUpdaterFunction<
		Data,
		SongID,
		unknown,
		ApolloCache<unknown>
	>