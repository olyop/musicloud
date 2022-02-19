import { AuthenticationError } from "apollo-server-fastify"
import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import resolver from "../resolver"
import createJWT from "./create-jwt"
import { User } from "../../../types"
import userExists from "./user-exists"
import isPasswordCorrect from "./is-password-correct"
import { SELECT_USER_NAME_PASSWORD } from "../../../sql"

export const logIn =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { userID } = args.input
			if (await userExists(context.pg)({ userID })) {
				const { name, password } =
					await query(context.pg)(SELECT_USER_NAME_PASSWORD)({
						variables: { userID },
						parse: convertFirstRowToCamelCase<SelectUserNamePasswordRow>(),
					})
				if (await isPasswordCorrect(args.input.password, password)) {
					return createJWT(context.ag.client)({ userID, name })
				} else {
					throw new AuthenticationError("Password is incorrect")
				}
			} else {
				throw new AuthenticationError("User does not exist")
			}
		},
		{ globalContext: false },
	)

type SelectUserNamePasswordRow =
	Pick<User, "name" | "password">

type Args =
	InterfaceWithInput<Pick<User, "userID" | "password">>