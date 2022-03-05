import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

const determineCatalogPath =
	(objectID: string, path: string) =>
		`${removeDashesFromUUID(objectID)}${path}`

export default determineCatalogPath