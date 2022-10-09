import { SongID } from "@oly_op/musicloud-common/build/types";
import { ApolloCache, MutationUpdaterFunction } from "@apollo/client";

import { QueueNowPlaying, Song } from "../../types";

export type Input = Song | SongID | null;

export interface GetQueueNowPlayingData {
	getQueue: QueueNowPlaying;
}

export interface PlaySongData {
	playSong: QueueNowPlaying;
}

export type UpdateIsOptimistic = (value: boolean) => void;

type MutationUpdaterFunctionReturn = MutationUpdaterFunction<
	PlaySongData,
	SongID,
	unknown,
	ApolloCache<unknown>
>;

export type Updater = (
	isOptimistic: boolean,
	updateIsOptimistic: UpdateIsOptimistic,
) => MutationUpdaterFunctionReturn;
