import { removeDashesFromUUID } from "@oly_op/uuid-dashes";

const determineCatalogPath = (objectID: string, path: string) =>
	`catalog/${removeDashesFromUUID(objectID)}${path}`;

export default determineCatalogPath;
