import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { BASE_S3_URL } from "@oly_op/music-app-common/globals"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

export const determineCatalogImageURL =
	(objectID: string, name: string, size: ImageSizes, dimension: ImageDimensions) =>
		`${BASE_S3_URL}/catalog/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`