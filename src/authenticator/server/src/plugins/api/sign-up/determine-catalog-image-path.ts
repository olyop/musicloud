import determineCatalogPath from "./determine-catalog-path";
import { ImageInput } from "./types";

const determineCatalogImagePath = (objectID: string, { name, size, dimension }: ImageInput) =>
	determineCatalogPath(objectID, `/${name}/${size}-${dimension}.jpg`);

export default determineCatalogImagePath;
