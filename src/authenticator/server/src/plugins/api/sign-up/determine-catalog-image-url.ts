import { FILES_CATALOG_URL } from "@oly_op/musicloud-common/build/globals";

import determineCatalogImagePath from "./determine-catalog-image-path";
import { ImageInput } from "./types";

const determineCatalogImageURL = (objectID: string, image: ImageInput) =>
	`${FILES_CATALOG_URL}/${determineCatalogImagePath(objectID, image)}`;

export default determineCatalogImageURL;
