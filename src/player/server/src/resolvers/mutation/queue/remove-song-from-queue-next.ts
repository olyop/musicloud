import resolver from "../resolver"
import { IndexOptions } from "../../../types"
import { removeSongFromQueue } from "../../helpers"

export const removeSongFromQueueNext =
	resolver<Record<string, never>, IndexOptions>(
		({ args, context }) => (
			removeSongFromQueue(context.pg)({
				index: args.index,
				tableName: "queue_nexts",
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
			})
		),
	)