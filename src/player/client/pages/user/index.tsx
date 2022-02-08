import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, Fragment, VFC } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { NavLink, Route, Routes, useParams } from "react-router-dom"
import { ImageDimensions, ImageSizes, UserID } from "@oly_op/music-app-common/types"

import { User } from "../../types"
import UserFollowers from "./followers"
import Banner from "../../components/banner"
import GET_USER_PAGE from "./get-user-page.gql"
import { createCatalogImageURL } from "../../helpers"
import { useQuery, useToggleUserFollowing } from "../../hooks"

const UserPageHome: VFC = () => (
	<p className="BodyOne">
		W.I.P.
	</p>
)

const UserPage: VFC = () => {
	const params = useParams<keyof UserID>()
	const userID = addDashesToUUID(params.userID!)

	const { data, error } =
		useQuery<GetUserPageData, UserID>(GET_USER_PAGE, {
			variables: { userID },
		})

	const [ toggleUserFollowing, isFollowing, isUser ] =
		useToggleUserFollowing({ userID })

	if (error) {
		return (
			<h2 className="Content BodyOne PaddingTopBottom">
				{error.message === "Failed to fetch" ?
					error.message :
					"User does not exist."}
			</h2>
		)
	} else if (data) {
		const { name, isFollower, dateJoined } = data.getUserByID
		const dateJoinedString = new Date(dateJoined).toISOString().slice(0, 10)
		return (
			<Metadata title={name}>
				<Banner
					title={(
						<NavLink to="">
							{name}
						</NavLink>
					)}
					subTitle={(
						!isUser && isFollower ?
							`${dateJoinedString} - Follows you` :
							`${dateJoinedString}`
					)}
					buttons={(
						<Fragment>
							{isUser ? (
								<NavLink to="/manage-account">
									<Button
										text="Manage"
										title="Manage Account"
										icon="manage_accounts"
									/>
								</NavLink>
							) : (
								<Button
									onClick={toggleUserFollowing}
									icon={isFollowing ? "done" : "person_add"}
									text={isFollowing ? "Following" : "Follow"}
								/>
							)}
							<NavLink to="followers">
								{({ isActive }) => (
									<Button
										icon="person"
										text="Followers"
										style={isActive ? {
											backgroundColor: "var(--primary-color-dark)",
										} : undefined}
									/>
								)}
							</NavLink>
						</Fragment>
					)}
					coverURL={createCatalogImageURL(
						userID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.LANDSCAPE,
					)}
					profileURL={createCatalogImageURL(
						userID,
						"profile",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					)}
				/>
				<div className="Content PaddingTopBottom">
					<Routes>
						<Route
							path=""
							key="home"
							element={<UserPageHome/>}
						/>
						<Route
							key="followers"
							path="followers"
							element={<UserFollowers/>}
						/>
					</Routes>
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