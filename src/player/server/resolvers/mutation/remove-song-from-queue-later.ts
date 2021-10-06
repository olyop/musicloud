import { User } from "../../types"
import { createResolver, removeSongFromQueue } from "../helpers"

const resolver =
	createResolver()

interface Args {
	index: number,
}

export const removeSongFromQueueLater =
	resolver<User, Args>(
		({ args, context }) => (
			removeSongFromQueue(context.pg)(context.authorization!.userID)(
				"queue_laters",
				args.index,
			)
		),
	)