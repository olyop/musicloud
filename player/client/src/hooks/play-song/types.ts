import { SongID } from "@oly_op/musicloud-common"

import {
	ApolloCache,
	MutationUpdaterFunction as MutationUpdaterFunctionBase,
} from "@apollo/client"

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

type MutationUpdaterFunctionReturn =
	MutationUpdaterFunctionBase<
		Data,
		SongID,
		unknown,
		ApolloCache<unknown>
	>

export type MutationUpdaterFunction =
	(options: UpdateOptions) => MutationUpdaterFunctionReturn