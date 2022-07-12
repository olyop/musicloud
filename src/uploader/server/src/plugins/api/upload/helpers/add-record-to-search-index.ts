import { SearchIndex } from "algoliasearch"
import { AlgoliaRecord } from "@oly_op/musicloud-common"

export const addRecordToSearchIndex =
	(ag: SearchIndex) =>
		async <T extends AlgoliaRecord>(input: T) => {
			await ag.saveObject(input)
		}