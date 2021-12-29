import bcrypt from "bcrypt"
import { createSigner } from "fast-jwt"
import { SearchClient } from "algoliasearch"
import { AuthenticationError } from "apollo-server-fastify"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"
import { JWTPayload, InterfaceWithInput, UserID } from "@oly_op/music-app-common/types"

import resolver from "./resolver"
import { User } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_USER_NAME_PASSWORD } from "../../sql"

const signer =
	createSigner({
		algorithm: "HS256",
		expiresIn: 1000 * 60 * 60 * 24,
		key: process.env.JWT_TOKEN_SECRET,
	})

const createJWT =
	(payload: JWTPayload) =>
		signer(payload)

const createAlgoliaAPIKey =
	(ag: SearchClient) =>
		({ userID }: UserID) =>
			ag.generateSecuredApiKey(process.env.ALGOLIA_SEARCH_API_KEY, {
				filters: `NOT privacy:PRIVATE OR user.userID:"${userID}"`,
			})

type SelectUserNamePasswordRow =
	Pick<User, "name" | "password">

type Args =
	InterfaceWithInput<Pick<User, "userID" | "password">>

export const logIn =
	resolver<string, Args>(
		async ({ args, context }) => {
			const { userID } =
				args.input
			const userExists =
				await exists(context.pg)({
					value: userID,
					table: "users",
					column: COLUMN_NAMES.USER[0],
				})
			if (userExists) {
				const { name, password } =
					await query(context.pg)(SELECT_USER_NAME_PASSWORD)({
						variables: { userID },
						parse: convertFirstRowToCamelCase<SelectUserNamePasswordRow>(),
					})
				const isPasswordCorrect =
					await bcrypt.compare(args.input.password, password)
				if (isPasswordCorrect) {
					const algoliaKey = createAlgoliaAPIKey(context.ag.client)({ userID })
					return createJWT({ userID, name, algoliaKey })
				} else {
					throw new AuthenticationError("Password is incorrect")
				}
			} else {
				throw new AuthenticationError("User does not exist")
			}
		},
		{ globalContext: false },
	)