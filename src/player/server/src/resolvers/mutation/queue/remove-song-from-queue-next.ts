import { IndexOptions } from "../../../types";
import { removeSongFromQueue } from "../../helpers";
import resolver from "../resolver";

export const removeSongFromQueueNext = resolver<Record<string, never>, IndexOptions>(
	async ({ args, context }) => {
		await removeSongFromQueue(context.pg)({
			index: args.index,
			tableName: "queue_nexts",
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		});

		return {};
	},
);
