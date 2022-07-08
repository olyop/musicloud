import { DocumentNode } from "@apollo/client"

import {
	Queue,
	QueueNext,
	QueueLater,
	QueueNextLater,
	ClassNameBEMPropTypes,
	SettingsQueuesDisclosureKeys,
} from "../../types"

export interface IndexVars {
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
	queueKey: SettingsQueuesDisclosureKeys,
}