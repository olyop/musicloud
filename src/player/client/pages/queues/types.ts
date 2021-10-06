import { BEMPropTypes } from "@oly_op/bem"
import type { DocumentNode } from "graphql"

import { UserQueues, UserPartial } from "../../types"

export interface RemoveVars {
	index: number,
}

export interface NowPlayingData {
	user: UserPartial,
}

export interface ClearQueuesData {
	clearQueues: UserPartial,
}

export interface ShuffleNextData {
	shuffleNext: UserPartial,
}

export interface ClearNextQueuesData {
	clearNextQueues: UserPartial,
}

export interface RemoveNextData {
	removeSongFromQueueNext: UserPartial,
}

export interface RemoveLaterData {
	removeSongFromQueueLater: UserPartial,
}

export interface QueuePropTypes extends BEMPropTypes {
	name: string,
	query: DocumentNode,
	queueKey: keyof UserQueues,
	removeQuery?: DocumentNode,
}