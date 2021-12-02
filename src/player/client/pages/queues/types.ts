import type { DocumentNode } from "graphql"

import {
	Queue,
	QueueNext,
	QueueLater,
	QueueNextLater,
	ClassNameBEMPropTypes,
	SettingsQueuesDisclosureKeys,
} from "../../types"

export interface Data {
	getQueue: Queue,
}

export interface RemoveVars {
	index: number,
}

export interface ClearQueuesData {
	clearQueues: Queue,
}

export interface ShuffleNextData {
	shuffleNext: QueueNext & QueueLater,
}

export interface ClearNextQueuesData {
	clearNextQueues: QueueNextLater,
}

export interface RemoveNextData {
	removeSongFromQueueNext: QueueNext,
}

export interface RemoveLaterData {
	removeSongFromQueueLater: QueueLater,
}

export interface QueuePropTypes extends ClassNameBEMPropTypes {
	name: string,
	query: DocumentNode,
	removeQuery?: DocumentNode,
	queueKey: SettingsQueuesDisclosureKeys,
}