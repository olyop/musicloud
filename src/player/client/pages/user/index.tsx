import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { NavLink, useParams } from "react-router-dom"
import { Metadata } from "@oly_op/react-metadata"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes, UserID } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import FOLLOW_USER from "./follow-user.gql"
import Banner from "../../components/banner"
import GET_USER_PAGE from "./get-user-page.gql"
import UN_FOLLOW_USER from "./un-follow-user.gql"
import { determineCatalogImageURL } from "../../helpers"
import { useMutation, useQuery, useJWTPayload } from "../../hooks"

const UserPage: VFC = () => {
	const params = useParams<keyof UserID>()
	const { userID: ownUserID } = useJWTPayload()
	const userID = addDashesToUUID(params.userID!)

	const { data, error } =
		useQuery<GetUserPageData, UserID>(GET_USER_PAGE, {
			variables: { userID },
		})

	const [ followUser ] =
		useMutation<unknown, UserID>(FOLLOW_USER, {
			variables: { userID },
		})

	const [ unFollowUser ] =
		useMutation<unknown, UserID>(UN_FOLLOW_USER, {
			variables: { userID },
		})

	const isOwnPage =
		userID === ownUserID

	const handleFollowUser =
		async () => {
			if (!isOwnPage && data) {
				if (data.getUserByID.following) {
					await unFollowUser()
				} else {
					await followUser()
				}
			}
		}

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"User does not exist."}
			</h2>
		)
	} else if (data) {
		const { name, dateJoined, follower, following } = data.getUserByID
		const dateJoinedString = new Date(dateJoined).toISOString().slice(0, 10)
		return (
			<Metadata title={name}>
				<Banner
					title={name}
					subTitle={(
						!isOwnPage && follower ?
							`${dateJoinedString} - Follows you` :
							`${dateJoinedString}`
					)}
					buttons={(
						isOwnPage ? (
							<NavLink to="/manage-account">
								<Button
									text="Manage"
									title="Manage Account"
									icon="manage_accounts"
								/>
							</NavLink>
						) : (
							<Button
								onClick={handleFollowUser}
								icon={following ? "done" : "person_add"}
								text={following ? "Following" : "Follow"}
							/>
						)
					)}
					coverURL={determineCatalogImageURL(
						userID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.LANDSCAPE,
					)}
					profileURL={determineCatalogImageURL(
						userID,
						"profile",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					)}
				/>
				<div className="Content PaddingTopBottom">
					<p className="BodyOne MarginBottomHalf">
						W.I.P.
					</p>
				</div>
			</Metadata>
		)
	} else {
		return null
	}
}

interface GetUserPageData {
	getUserByID: User,
}

export default UserPage