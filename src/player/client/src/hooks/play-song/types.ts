import { SongID } from "@oly_op/musicloud-common/build/types"
import { ApolloCache,	MutationUpdaterFunction } from "@apollo/client"

import { QueueNowPlaying, Song } from "../../types"

export type Input =
	Song | SongID | null

export interface QueryData {
	getQueue: QueueNowPlaying,
}

export interface MutationData {
	playSong: QueueNowPlaying,
}

export type UpdateIsOptimistic =
	(value: boolean) => void

type MutationUpdaterFunctionReturn =
	MutationUpdaterFunction<
		MutationData,
		SongID,
		unknown,
		ApolloCache<unknown>
	>

export type Updater =
	(isOptimistic: boolean, updateIsOptimistic: UpdateIsOptimistic) => MutationUpdaterFunctionReturn