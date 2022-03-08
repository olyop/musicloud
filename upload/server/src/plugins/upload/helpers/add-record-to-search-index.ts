import { AlgoliaRecord } from "@oly_op/musicloud-common"

import { ag } from "../../../services"

export const addRecordToSearchIndex =
	async <T extends AlgoliaRecord>(input: T) => {
		await ag.saveObject(input)
	}