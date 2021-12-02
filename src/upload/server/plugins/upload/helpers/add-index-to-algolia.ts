import { ObjectID } from "@oly_op/music-app-common/types"

import { ag } from "../../../services"

interface Input extends ObjectID {
	text: string,
	image?: string,
	typeName: string,
}

export const addIndexToAlgolia =
	async (input: Input) => {
		await ag.saveObject(input)
	}