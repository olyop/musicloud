import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

export const determineS3AudioPath =
	(objectID: string) =>
		`/${removeDashesFromUUID(objectID)}/audio/index.mp3`