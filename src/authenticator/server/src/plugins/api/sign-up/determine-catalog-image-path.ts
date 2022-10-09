import { ImageInput } from "./types";
import determineCatalogPath from "./determine-catalog-path";

const determineCatalogImagePath = (objectID: string, { name, size, dimension }: ImageInput) =>
	determineCatalogPath(objectID, `/${name}/${size}-${dimension}.jpg`);

export default determineCatalogImagePath;
