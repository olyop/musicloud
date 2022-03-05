import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { CLOUDFRONT_CATALOG_URL } from "@oly_op/music-app-common/globals"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

export const createCatalogImageURL =
	(objectID: string, name: string, size: ImageSizes, dimension: ImageDimensions) =>
		`${CLOUDFRONT_CATALOG_URL}/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`