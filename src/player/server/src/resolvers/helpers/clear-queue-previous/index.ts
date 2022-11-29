import { UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, importSQL, query } from "@oly_op/pg-helpers";

const EXECUTE_CLEAR_QUEUE_PREVIOUS = await importSQL(import.meta.url)(
	"execute-clear-queue-previous",
);

export const clearQueuePrevious =
	(client: PoolOrClient) =>
	({ userID }: UserID) =>
		query(client)(EXECUTE_CLEAR_QUEUE_PREVIOUS)({
			variables: {
				userID,
			},
		});
