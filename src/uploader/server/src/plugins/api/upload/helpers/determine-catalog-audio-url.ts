import { FILES_URL } from "@oly_op/musicloud-common/build/globals";

import { determineCatalogAudioPath } from "./determine-catalog-audio-path";

export const determineS3AudioURL = (objectID: string) =>
	`/${FILES_URL}${determineCatalogAudioPath(objectID)}`;
