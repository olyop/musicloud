import { BASE_S3_URL } from "@oly_op/music-app-common/globals"

import { ImageInput } from "../types"
import { determineS3ImagePath } from "./determine-s3-image-path"

export const determineS3ImageURL =
	(objectID: string, image: ImageInput) =>
		`${BASE_S3_URL}/${determineS3ImagePath(objectID, image)}`