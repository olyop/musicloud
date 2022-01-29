import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { CATALOG_CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"

export const createCatalogMP3URL =
	(songID: string) =>
		`${CATALOG_CLOUDFRONT_URL}/${removeDashesFromUUID(songID)}/audio/index.mp3`