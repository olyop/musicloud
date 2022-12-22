import { FILES_CATALOG_URL } from "@oly_op/musicloud-common/build/globals";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";

export const createCatalogImageURL = (
	objectID: string,
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
) => `${FILES_CATALOG_URL}/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`;
