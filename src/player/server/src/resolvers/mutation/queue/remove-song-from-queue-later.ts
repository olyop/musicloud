import { IndexOptions } from "../../../types";
import { removeSongFromQueue } from "../../helpers";
import resolver from "../resolver";

export const removeSongFromQueueLater = resolver<Record<string, never>, IndexOptions>(
	async ({ args, context }) => {
		await removeSongFromQueue(context.pg)({
			index: args.index,
			tableName: "queue_laters",
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		});

		return {};
	},
);
