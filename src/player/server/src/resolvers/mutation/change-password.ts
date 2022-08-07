import { query } from "@oly_op/pg-helpers"
import { UserPasswordBase } from "@oly_op/musicloud-common/build/types"

import resolver from "./resolver"
import { hashPassword } from "../helpers"
import { UPDATE_USER_PASSWORD } from "../../sql"

export const changePassword =
	resolver<void, UserPasswordBase>(
		async ({ args, context }) => {
			await query(context.pg)(UPDATE_USER_PASSWORD)({
				variables: [{
					key: "userID",
					value: context.getAuthorizationJWTPayload(context.authorization).userID,
				},{
					key: "password",
					parameterized: true,
					value: await hashPassword(args),
				}],
			})
		},
	)