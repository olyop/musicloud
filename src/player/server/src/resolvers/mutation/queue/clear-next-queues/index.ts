import { importSQL, query } from "@oly_op/pg-helpers";

import resolver from "../../resolver.js";

const EXECUTE_CLEAR_NEXT_QUEUES = await importSQL(import.meta.url)("execute-clear-next-queues");

export const clearNextQueues = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	await query(context.pg)(EXECUTE_CLEAR_NEXT_QUEUES)({
		variables: {
			userID,
		},
	});

	return {};
});
