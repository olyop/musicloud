import { determineCatalogPath } from "./determine-catalog-path.js";

export const determineCatalogAudioPath = (objectID: string) =>
	determineCatalogPath(objectID, "/audio/index.mp3");
