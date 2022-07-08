import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { clearQueue } from "../helpers"

export const clearQueues =
	resolver<Record<string, never>>(
		async ({ context }) => {
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgHelpersQuery(client)

			try {
				await query("BEGIN")()
				await clearQueue(client)({ userID })
				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return {}
		},
	)