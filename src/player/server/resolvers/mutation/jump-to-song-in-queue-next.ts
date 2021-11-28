import resolver from "./resolver"
import { IndexOptions } from "../../types"
import { jumpToSongInQueue } from "../helpers"

export const removeSongFromQueueNext =
	resolver<void, IndexOptions>(
		({ args, context }) => (
			jumpToSongInQueue(context.pg)({
				index: args.index,
				tableName: "queue_nexts",
				userID: context.authorization!.userID,
			})
		),
	)