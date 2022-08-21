import { isEmpty } from "lodash-es"
import { query } from "@oly_op/pg-helpers"
import { UserPasswordBase } from "@oly_op/musicloud-common/build/types"

import resolver from "./resolver"
import { hashPassword } from "../helpers"
import { UPDATE_USER_PASSWORD } from "../../sql"

export const changePassword =
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	resolver<void, UserPasswordBase>(
		async ({ args, context }) => {
			const { password } = args
			if (!isEmpty(password) && password.length >= 10) {
				await query(context.pg)(UPDATE_USER_PASSWORD)({
					variables: [{
						key: "userID",
						value: context.getAuthorizationJWTPayload(context.authorization).userID,
					},{
						key: "password",
						parameterized: true,
						value: await hashPassword({ password: args.password }),
					}],
				})
			} else {
				throw new Error("Invalid New Password")
			}
		},
	)