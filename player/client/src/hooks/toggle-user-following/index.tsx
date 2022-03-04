import isUndefined from "lodash-es/isUndefined"
import { UserID } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import { useQuery } from "../query"
import { useMutation } from "../mutation"
import FOLLOW_USER from "./follow-user.gql"
import { useJWTPayload } from "../jwt-payload"
import UN_FOLLOW_USER from "./un-follow-user.gql"
import GET_USER_FOLLOWING from "./get-user-following.gql"

export const useToggleUserFollowing =
	({ userID }: UserID) => {
		const { userID: ownUserID } =
			useJWTPayload()

		const { data } =
			useQuery<GetUserFollowingData, UserID>(GET_USER_FOLLOWING, {
				variables: { userID },
				fetchPolicy: "cache-only",
			})

		const [ followUser ] =
			useMutation<unknown, UserID>(FOLLOW_USER, {
				variables: { userID },
			})

		const [ unFollowUser ] =
			useMutation<unknown, UserID>(UN_FOLLOW_USER, {
				variables: { userID },
			})

		const isUser =
			userID === ownUserID

		const isFollowing =
			isUser ?
				false : (
					isUndefined(data) ?
						false :
						data.getUserByID.isFollowing
				)

		const handler =
			() => {
				void (isFollowing ? unFollowUser : followUser)()
			}

		return [ handler, isFollowing, isUser ] as const
	}

interface GetUserFollowingData {
	getUserByID: User,
}