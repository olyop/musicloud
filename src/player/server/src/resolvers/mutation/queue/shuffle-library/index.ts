import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver.js";

const EXECUTE_SHUFFLE_LIBRARY = await importSQL(import.meta.url)("execute-shuffle-library");

export const shuffleLibrary = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_SHUFFLE_LIBRARY)({
		variables: {
			userID,
		},
	});

	return {};
});
