import { query as pgQuery } from "@oly_op/pg-helpers"

import { User } from "../../types"

import {
	createResolver,
	getUserWithQueues,
	clearQueuesNowPlaying,
} from "../helpers"

const resolver =
	createResolver()

export const clearQueues =
	resolver<User>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)

			let user: User

			try {
				await query("BEGIN")()
				await clearQueuesNowPlaying(client)(userID)
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