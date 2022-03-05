import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { CLOUDFRONT_CATALOG_URL } from "@oly_op/music-app-common/globals"

export const createCatalogMP3URL =
	(songID: string) =>
		`${CLOUDFRONT_CATALOG_URL}/${removeDashesFromUUID(songID)}/audio/index.mp3`