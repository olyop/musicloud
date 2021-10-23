import { User } from "../../types"
import { createResolver, jumpToSongInQueue } from "../helpers"

const resolver =
	createResolver()

interface Args {
	index: number,
}

export const removeSongFromQueueNext =
	resolver<User, Args>(
		({ args, context }) => (
			jumpToSongInQueue(context.pg)(context.authorization!.userID)(
				"queue_nexts",
				args.index,
			)
		),
	)