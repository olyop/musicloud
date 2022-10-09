import { removeDashesFromUUID } from "@oly_op/uuid-dashes";
import { ObjectTypeNames } from "@oly_op/musicloud-common/build/types";

export const createObjectPath = (typeName: Lowercase<ObjectTypeNames>, objectID: string) =>
	`/${typeName}/${removeDashesFromUUID(objectID)}`;
