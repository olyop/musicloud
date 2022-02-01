import { CLOUDFRONT_URL } from "@oly_op/music-app-common/globals"

import { determineS3AudioPath } from "./determine-s3-audio-path"

export const determineS3AudioURL =
	(objectID: string) =>
		`/${CLOUDFRONT_URL}${determineS3AudioPath(objectID)}`