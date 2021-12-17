import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

import { ImageInput } from "../types"

export const determineS3ImagePath =
	(objectID: string, { name, size, dimension }: ImageInput) =>
		`catalog/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`