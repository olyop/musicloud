import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { isNull, isUndefined } from "lodash"
import { AuthenticationError } from "apollo-server-fastify"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"
import { UserIDBase, InterfaceWithInput } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import { createResolver } from "../helpers"
import { SELECT_USER_PASSWORD } from "../../sql"
import { JWT_TOKEN_SECRET, JWT_SIGN_OPTIONS } from "../../globals"

const generateAccessToken =
	(userID: string) =>
		new Promise<string>(
			(resolve, reject) => {
				jwt.sign(
					{ userID },
					JWT_TOKEN_SECRET,
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

const resolver =
	createResolver()

interface Input extends UserIDBase {
	password: string,
}

export const logIn =
	resolver<string, InterfaceWithInput<Input>>(
		async ({ args, context }) => {
			const { userID } = args.input

			const userExists =
				await exists(context.pg)({
					value: userID,
					table: "users",
					column: "user_id",
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
					throw new AuthenticationError("Password is not correct")
				}
			} else {
				throw new AuthenticationError("User does not exist")
			}
		},
		false,
	)