import { UserID } from "@oly_op/musicloud-common/build/types"
import { getResultExists, query } from "@oly_op/pg-helpers"

import resolver from "./resolver"
import { User } from "../../types"
import { getUser } from "../helpers"
import { EXISTS_USER_FOLLOWER, DELETE_USER_FOLLOWER } from "../../sql"

export const unFollowUser =
	resolver<User, UserID>(
		async ({ args, context }) => {
			const { userID } = args
			const followerUserID = context.getAuthorizationJWTPayload(context.authorization).userID

			if (userID === followerUserID) {
				throw new Error("Cannot unfollow yourself")
			}

			const isFollowing =
				await query(context.pg)(EXISTS_USER_FOLLOWER)({
					parse: getResultExists,
					variables: { userID, followerUserID },
				})

			if (isFollowing) {
				await query(context.pg)(DELETE_USER_FOLLOWER)({
					variables: { userID, followerUserID },
				})
			}

			return getUser(context.pg)(args)
		},
	)