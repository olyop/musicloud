import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";

const EXECUTE_CLEAR_QUEUE_LATER = await importSQL(import.meta.url)("execute-clear-queue-later");

export const clearQueueLater =
	(client: PoolOrClient) =>
	({ userID }: UserID) =>
		query(client)(EXECUTE_CLEAR_QUEUE_LATER)({
			variables: {
				userID,
			},
		});
