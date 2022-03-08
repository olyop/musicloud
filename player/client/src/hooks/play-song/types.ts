import { SongID } from "@oly_op/musicloud-common"
import { ApolloCache, MutationUpdaterFunction } from "@apollo/client"

import { QueueNowPlaying, Song } from "../../types"

export type Input =
	Song | SongID

export type ToggleIsOptimistic =
	(value: boolean) => void

export interface QueryData {
	getQueue: QueueNowPlaying,
}

export interface Data {
	playSong: QueueNowPlaying,
}

interface UpdateOptions {
	isOptimistic: boolean,
	toggleIsOptimistic: ToggleIsOptimistic,
}

type UpdateReturn =
	MutationUpdaterFunction<
		Data,
		SongID,
		unknown,
		ApolloCache<unknown>
	>

export type Update =
	(options: UpdateOptions) => UpdateReturn