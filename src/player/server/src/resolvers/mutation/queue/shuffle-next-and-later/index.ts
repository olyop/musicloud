import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver.js";

const EXECUTE_SHUFFLE_NEXT_LATER = await importSQL(import.meta.url)("execute-shuffle-next-later");

export const shuffleNextAndLater = resolver(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_SHUFFLE_NEXT_LATER)({
		variables: {
			userID,
		},
	});

	return {};
});
