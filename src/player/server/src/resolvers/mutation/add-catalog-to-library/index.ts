import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../resolver";

const EXECUTE_ADD_CATALOG_TO_LIBRARY = await importSQL(import.meta.url)(
	"execute-add-catalog-to-library",
);

export const addCatalogToLibrary = resolver(({ context }) =>
	query(context.pg)(EXECUTE_ADD_CATALOG_TO_LIBRARY)({
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);
