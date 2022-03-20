import { query } from "@oly_op/pg-helpers"

import { UPDATE_USER_PASSWORD } from "../../sql"

import resolver from "./resolver"

interface Args {
	password: string,
}

export const changePassword =
	resolver<void, Args>(
		async ({ context }) => (
			query(context.pg)(UPDATE_USER_PASSWORD)({
				variables: {
					password: "password",
					// password: args.password,
					userID: context.authorization!.userID,
				},
			})
		),
	)