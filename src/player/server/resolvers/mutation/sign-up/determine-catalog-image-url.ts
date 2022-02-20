import { CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"

import { ImageInput } from "./types"
import determineCatalogImagePath from "./determine-catalog-image-path"

const determineCatalogImageURL =
	(objectID: string, image: ImageInput) =>
		`${CLOUDFRONT_URL}/${determineCatalogImagePath(objectID, image)}`

export default determineCatalogImageURL