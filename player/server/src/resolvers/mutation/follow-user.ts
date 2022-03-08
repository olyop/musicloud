import { UserID } from "@oly_op/musicloud-common"
import { UserInputError } from "apollo-server-fastify"
import { exists, getResultExists, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { User } from "../../types"
import { getUser } from "../helpers"
import { COLUMN_NAMES } from "../../globals"
import { EXISTS_USER_FOLLOWER, INSERT_USER_FOLLOWER } from "../../sql"

export const followUser =
	resolver<User, UserID>(
		async ({ args, context }) => {
			const { userID } = args
			const followerUserID = context.authorization!.userID

			if (userID === followerUserID) {
				throw new UserInputError("Cannot follow yourself")
			}

			const userExists =
				await exists(context.pg)({
					table: "users",
					value: userID,
					column: COLUMN_NAMES.USER[0],
				})

			if (!userExists) {
				throw new UserInputError("User does not exist")
			}

			const isFollowing =
				await query(context.pg)(EXISTS_USER_FOLLOWER)({
					parse: getResultExists,
					variables: { userID, followerUserID },
				})

			if (isFollowing) {
				throw new UserInputError("Already following this user")
			}

			await query(context.pg)(INSERT_USER_FOLLOWER)({
				variables: { userID, followerUserID },
			})

			return getUser(context.pg)(args)
		},
	)