import { determineCatalogPath } from "./determine-catalog-path"

export const determineCatalogAudioPath =
	(objectID: string) =>
		determineCatalogPath(objectID, "/audio/index.mp3")