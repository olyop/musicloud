import isUndefined from "lodash-es/isUndefined"
import { UserID } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import FOLLOW_USER from "./follow-user.gql"
import { useJWTPayload } from "../jwt-payload"
import UN_FOLLOW_USER from "./un-follow-user.gql"
import { HandlerPromise, User } from "../../types"
import GET_USER_FOLLOWING from "./get-user-following.gql"

export const useToggleUserFollowing =
	({ userID }: UserID): Return => {
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
			async () => {
				await (isFollowing ? unFollowUser : followUser)()
			}

		return [
			handler,
			isFollowing,
			isUser,
		]
	}

type Return = [
	toggleUserFollowing: HandlerPromise,
	isFollowing: boolean,
	isUser: boolean,
]

interface GetUserFollowingData {
	getUserByID: User,
}