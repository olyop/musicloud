import { DocumentNode } from "@apollo/client"

import {
	Queue,
	QueueNext,
	QueueLater,
	QueueNextLater,
	ClassNameBEMPropTypes,
	SettingsQueuesDisclosureKeys,
} from "../../types"

export interface ClearQueuesData {
	clearQueues: Queue,
}

export interface ShuffleNextData {
	shuffleNext: QueueNext & QueueLater,
}

export interface ClearNextQueuesData {
	clearNextQueues: QueueNextLater,
}

export interface QueuePropTypes extends ClassNameBEMPropTypes {
	name: string,
	query: DocumentNode,
	queueKey: SettingsQueuesDisclosureKeys,
}