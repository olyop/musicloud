import { pipe } from "rxjs"
import { AuthenticationError } from "apollo-server-fastify"
import { InterfaceWithInput, UserEmailAddress, UserID } from "@oly_op/musicloud-common"
import { query, convertFirstRowToCamelCase, join, PoolOrClient } from "@oly_op/pg-helpers"

import resolver from "../resolver"
import { COLUMN_NAMES } from "../../../globals"
import { User, UserPassword } from "../../../types"
import isPasswordCorrect from "./is-password-correct"
import { createJWT, emailAddressExists } from "../../helpers"
import { SELECT_USER_BY_EMAIL, SELECT_USER_PASSWORD } from "../../../sql"

const getUser =
	(pg: PoolOrClient) =>
		({ emailAddress }: UserEmailAddress) =>
			query(pg)(SELECT_USER_BY_EMAIL)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: {
					emailAddress,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})

const getUserPassword =
	(pg: PoolOrClient) =>
		({ userID }: UserID) =>
			query(pg)(SELECT_USER_PASSWORD)({
				variables: { userID },
				parse: pipe(
					convertFirstRowToCamelCase<UserPassword>(),
					({ password }) => password
				),
			})

export const logIn =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { password, emailAddress } = args.input

			const doesUserExists =
				await emailAddressExists(context.pg)({ emailAddress })

			if (doesUserExists) {
				const user =
					await getUser(context.pg)({ emailAddress })

				const { userID } = user

				const hashedPassword =
					await getUserPassword(context.pg)({ userID })

				if (await isPasswordCorrect(password, hashedPassword)) {
					return createJWT(context.ag.client)(user)
				} else {
					throw new AuthenticationError("Password is incorrect")
				}
			} else {
				throw new AuthenticationError("Email Address does not exist")
			}
		},
		{ global: false },
	)

interface Input
	extends
	UserPassword,
	Pick<User, "emailAddress"> {}

type Args =
	InterfaceWithInput<Input>