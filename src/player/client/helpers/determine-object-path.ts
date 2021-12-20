import { TypeNames } from "@oly_op/music-app-common/types"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

export const determineObjectPath =
	(typeName: Lowercase<TypeNames>, objectID: string) =>
		`/${typeName}/${removeDashesFromUUID(objectID)}`