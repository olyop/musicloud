import { AlgoliaRecord } from "@oly_op/music-app-common/types"

import { ag } from "../../../services"

export const addIndexToAlgolia =
	async (input: Omit<AlgoliaRecord, "plays">) => {
		await ag.saveObject(input)
	}