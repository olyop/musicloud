import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { CATALOG_CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

export const createCatalogImageURL =
	(objectID: string, name: string, size: ImageSizes, dimension: ImageDimensions) =>
		`${CATALOG_CLOUDFRONT_URL}/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`