import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../resolver";

const DELETE_LIBRARY = await importSQL(import.meta.url)("execute-delete-library");

export const deleteLibrary = resolver(async ({ context }) => {
	await query(context.pg)(DELETE_LIBRARY)({
		variables: { userID: context.getAuthorizationJWTPayload(context.authorization).userID },
	});
});
