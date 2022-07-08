import { AlgoliaRecord } from "@oly_op/musicloud-common"

import { agIndex } from "../../../services"

export const addRecordToSearchIndex =
	async <T extends AlgoliaRecord>(input: T) => {
		await agIndex.saveObject(input)
	}