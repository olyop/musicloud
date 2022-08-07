import { UserID } from "@oly_op/musicloud-common/build/types"
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
			const followerUserID = context.getAuthorizationJWTPayload(context.authorization).userID

			if (userID === followerUserID) {
				throw new Error("Cannot follow yourself")
			}

			const userExists =
				await exists(context.pg)({
					table: "users",
					value: userID,
					column: COLUMN_NAMES.USER[0],
				})

			if (!userExists) {
				throw new Error("User does not exist")
			}

			const isFollowing =
				await query(context.pg)(EXISTS_USER_FOLLOWER)({
					parse: getResultExists,
					variables: { userID, followerUserID },
				})

			if (isFollowing) {
				throw new Error("Already following this user")
			}

			await query(context.pg)(INSERT_USER_FOLLOWER)({
				variables: { userID, followerUserID },
			})

			return getUser(context.pg)(args)
		},
	)