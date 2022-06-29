import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

export const determineCatalogPath =
	(objectID: string, path: string) =>
		`catalog/${removeDashesFromUUID(objectID)}${path}`