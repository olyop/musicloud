import resolver from "./resolver"
import { IndexOptions } from "../../types"
import { removeSongFromQueue } from "../helpers"

export const removeSongFromQueueLater =
	resolver<Record<string, never>, IndexOptions>(
		({ args, context }) => (
			removeSongFromQueue(context.pg)({
				index: args.index,
				tableName: "queue_laters",
				userID: context.authorization!.userID,
			})
		),
	)