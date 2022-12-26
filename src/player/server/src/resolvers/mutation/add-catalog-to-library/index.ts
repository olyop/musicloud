import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../resolver.js";

const isf = importSQL(import.meta.url);

const EXECUTE_ADD_CATALOG_TO_LIBRARY = await isf("execute-add-catalog-to-library");

export const addCatalogToLibrary = resolver(({ context }) =>
	query(context.pg)(EXECUTE_ADD_CATALOG_TO_LIBRARY)({
		variables: {
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
	}),
);
