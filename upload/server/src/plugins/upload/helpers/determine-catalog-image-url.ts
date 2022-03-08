import { CLOUDFRONT_URL } from "@oly_op/musicloud-common"

import { ImageInput } from "../types"
import { determineCatalogImagePath } from "./determine-catalog-image-path"

export const determineCatalogImageURL =
	(objectID: string, image: ImageInput) =>
		`${CLOUDFRONT_URL}/${determineCatalogImagePath(objectID, image)}`