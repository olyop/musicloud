import { TypeNames } from "@oly_op/musicloud-common"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

export const createObjectPath =
	(typeName: Lowercase<TypeNames>, objectID: string) =>
		`/${typeName}/${removeDashesFromUUID(objectID)}`