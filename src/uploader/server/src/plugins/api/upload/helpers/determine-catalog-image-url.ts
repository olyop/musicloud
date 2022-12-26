import { FILES_URL } from "@oly_op/musicloud-common/build/globals";

import { ImageInput } from "../../types.js";
import { determineCatalogImagePath } from "./determine-catalog-image-path.js";

export const determineCatalogImageURL = (objectID: string, image: ImageInput) =>
	`${FILES_URL}/${determineCatalogImagePath(objectID, image)}`;
