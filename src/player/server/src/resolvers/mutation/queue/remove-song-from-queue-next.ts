import { IndexOptions } from "../../../types/index.js";
import { removeSongFromQueue } from "../../helpers/index.js";
import resolver from "../resolver.js";

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
