import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { BASE_S3_URL } from "@oly_op/music-app-common/globals"

export const determineCatalogMP3URL =
	(songID: string) =>
		`${BASE_S3_URL}/catalog/${removeDashesFromUUID(songID)}/audio/index.mp3`