import { pipe } from "rxjs"
import { compare } from "bcrypt"
import { FastifyPluginAsync } from "fastify"
import { UserID, UserPasswordBase } from "@oly_op/musicloud-common/build/types"
import { query, convertFirstRowToCamelCase, PoolOrClient } from "@oly_op/pg-helpers"

import options from "./options"
import { Route } from "./types"
import { SELECT_USER_PASSWORD } from "./sql"
import { createJWT, emailAddressExists } from "../helpers"
import getUserFromEmailAddress from "./get-user-from-email-address"

const isPasswordCorrect =
	(inputPassword: string, hashedPassword: string) =>
		compare(inputPassword, hashedPassword)

const getUserPassword =
	(pg: PoolOrClient) =>
		({ userID }: UserID) =>
			query(pg)(SELECT_USER_PASSWORD)({
				variables: { userID },
				parse: pipe(
					convertFirstRowToCamelCase<UserPasswordBase>(),
					({ password }) => password,
				),
			})

export const logIn: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>(
			"/log-in",
			options,
			async request => {
				const { password, emailAddress } = request.body

				const doesEmailAddressExists =
					await emailAddressExists(fastify.pg.pool)({ emailAddress })

				if (doesEmailAddressExists) {
					const user =
						await getUserFromEmailAddress(fastify.pg.pool)({ emailAddress })

					const { userID } = user

					const hashedPassword =
						await getUserPassword(fastify.pg.pool)({ userID })

					if (await isPasswordCorrect(password, hashedPassword)) {
						return {
							accessToken: await createJWT(fastify.ag.client)(user),
						}
					} else {
						throw new Error("Password is incorrect")
					}
				} else {
					throw new Error("Email Address does not exist")
				}
			},
		)
	}