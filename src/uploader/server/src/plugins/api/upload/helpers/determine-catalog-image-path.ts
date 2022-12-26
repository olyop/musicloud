import { ImageInput } from "../../types.js";
import { determineCatalogPath } from "./determine-catalog-path.js";

export const determineCatalogImagePath = (
	objectID: string,
	{ name, size, dimension }: ImageInput,
) => determineCatalogPath(objectID, `/${name}/${size}-${dimension}.jpg`);
