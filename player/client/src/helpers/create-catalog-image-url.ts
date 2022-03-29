import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageSizes, ImageDimensions, FILES_CATALOG_URL } from "@oly_op/musicloud-common"

export const createCatalogImageURL =
	(objectID: string, name: string, size: ImageSizes, dimension: ImageDimensions) =>
		`${FILES_CATALOG_URL}/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`