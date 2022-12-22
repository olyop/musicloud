import { FILES_CATALOG_URL } from "@oly_op/musicloud-common/build/globals";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";

export const createCatalogMP3URL = (songID: string) =>
	`${FILES_CATALOG_URL}/${removeDashesFromUUID(songID)}/audio/index.mp3`;
