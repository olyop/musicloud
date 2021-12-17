import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { isNull, isUndefined } from "lodash"
import { AuthenticationError } from "apollo-server-fastify"
import { InterfaceWithInput } from "@oly_op/music-app-common/types"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { User } from "../../types"
import { SELECT_USER_PASSWORD } from "../../sql"
import { JWT_SIGN_OPTIONS, COLUMN_NAMES } from "../../globals"

const generateAccessToken =
	(userID: string) =>
		new Promise<string>(
			(resolve, reject) => {
				jwt.sign(
					{ userID },
					process.env.JWT_TOKEN_SECRET,
					JWT_SIGN_OPTIONS,
					(error, token) => {
						if (!isNull(error) || isUndefined(token)) {
							reject(error)
						} else {
							resolve(token)
						}
					},
				)
			},
		)

type Args =
	InterfaceWithInput<Pick<User, "userID" | "password">>

export const logIn =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { userID } = args.input

			const userExists =
				await exists(context.pg)({
					value: userID,
					table: "users",
					column: COLUMN_NAMES.USER[0],
				})

			if (userExists) {
				const { password } =
					await query(context.pg)(SELECT_USER_PASSWORD)({
						variables: { userID },
						parse: convertFirstRowToCamelCase<User>(),
					})
				const isPasswordCorrect =
					await bcrypt.compare(args.input.password, password)
				if (isPasswordCorrect) {
					return generateAccessToken(args.input.userID)
				} else {
					throw new AuthenticationError("Password is incorrect")
				}
			} else {
				throw new AuthenticationError("User does not exist")
			}
		},
		false,
	)