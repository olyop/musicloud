import { query as pgHelpersQuery } from "@oly_op/pg-helpers";

import resolver from "../resolver";
import { clearQueueNext, clearQueueLater } from "../../helpers";

export const clearNextQueues = resolver<Record<string, never>>(async ({ context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	const client = await context.pg.connect();
	const query = pgHelpersQuery(client);

	try {
		await query("BEGIN")();
		await clearQueueNext(client)({ userID });
		await clearQueueLater(client)({ userID });
		await query("COMMIT")();
	} catch (error) {
		await query("ROLLBACK")();
		throw error;
	} finally {
		client.release();
	}

	return {};
});
