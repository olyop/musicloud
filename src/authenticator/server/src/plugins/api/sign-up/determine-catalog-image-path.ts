import determineCatalogPath from "./determine-catalog-path.js";
import { ImageInput } from "./types.js";

const determineCatalogImagePath = (objectID: string, { name, size, dimension }: ImageInput) =>
	determineCatalogPath(objectID, `/${name}/${size}-${dimension}.jpg`);

export default determineCatalogImagePath;
