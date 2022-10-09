import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import { FILES_CATALOG_URL } from "@oly_op/musicloud-common/build/globals";
import { ImageSizes, ImageDimensions } from "@oly_op/musicloud-common/build/types";

export const createCatalogImageURL = (
	objectID: string,
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
) => `${FILES_CATALOG_URL}/${removeDashesFromUUID(objectID)}/${name}/${size}-${dimension}.jpg`;
