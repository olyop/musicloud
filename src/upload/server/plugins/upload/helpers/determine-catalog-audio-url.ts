import { CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"

import { determineCatalogAudioPath } from "./determine-catalog-audio-path"

export const determineS3AudioURL =
	(objectID: string) =>
		`/${CLOUDFRONT_URL}${determineCatalogAudioPath(objectID)}`