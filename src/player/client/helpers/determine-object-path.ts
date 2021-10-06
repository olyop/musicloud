import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

export const determineObjectPath =
	(typeName: string, objectID: string) =>
		`/${typeName}/${removeDashesFromUUID(objectID)}`