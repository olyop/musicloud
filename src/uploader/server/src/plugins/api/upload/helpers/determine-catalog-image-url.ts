import { FILES_URL } from "@oly_op/musicloud-common/build/globals"

import { ImageInput } from "../../types"
import { determineCatalogImagePath } from "./determine-catalog-image-path"

export const determineCatalogImageURL =
	(objectID: string, image: ImageInput) =>
		`${FILES_URL}/${determineCatalogImagePath(objectID, image)}`