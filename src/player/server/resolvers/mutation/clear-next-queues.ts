import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import { User } from "../../types"

import {
	createResolver,
	clearQueueNext,
	clearQueueLater,
	getUserWithQueues,
} from "../helpers"

const resolver =
	createResolver()

export const clearNextQueues =
	resolver<User>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			let user: User

			try {
				await query("BEGIN")()
				await clearQueueNext(client)(userID)
				await clearQueueLater(client)(userID)
				user = await getUserWithQueues(client)(userID)
				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return user
		},
	)