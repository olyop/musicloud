import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageInput } from "@oly_op/music-app-common/types"

export const determineS3ImagePath =
	(objectID: string, { name, size, dimension }: ImageInput) =>
		`catalog/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`