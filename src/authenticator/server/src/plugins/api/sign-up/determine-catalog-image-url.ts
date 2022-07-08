import { FILES_CATALOG_URL } from "@oly_op/musicloud-common"

import { ImageInput } from "./types"
import determineCatalogImagePath from "./determine-catalog-image-path"

const determineCatalogImageURL =
	(objectID: string, image: ImageInput) =>
		`${FILES_CATALOG_URL}/${determineCatalogImagePath(objectID, image)}`

export default determineCatalogImageURL