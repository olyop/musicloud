import { createElement, VFC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import { useQuery } from "../../hooks"
import User from "../../components/user"
import { User as UserType } from "../../types"
import GET_FOLLOWERS from "./get-followers.gql"

const FollowersPage: VFC = () => {
	const { data } =
		useQuery<QueryData>(GET_FOLLOWERS)
	return (
		<Metadata title="Followers">
			<div className="Content PaddingTopBottom">
				<div className="Elevated">
					{data?.getUser.followers?.map(
						follower => (
							<User
								user={follower}
								key={follower.userID}
							/>
						),
					)}
				</div>
			</div>
		</Metadata>
	)
}

interface QueryData {
	getUser: UserType,
}

export default FollowersPage