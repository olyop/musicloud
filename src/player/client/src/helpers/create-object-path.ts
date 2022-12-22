import { ObjectTypeNames } from "@oly_op/musicloud-common/build/types";
import { removeDashesFromUUID } from "@oly_op/uuid-dashes";

export const createObjectPath = (typeName: Lowercase<ObjectTypeNames>, objectID: string) =>
	`/${typeName}/${removeDashesFromUUID(objectID)}`;
