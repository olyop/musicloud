import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { createElement, Fragment, FC } from "react";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { ImageDimensions, ImageSizes, UserID } from "@oly_op/musicloud-common/build/types";

import { User } from "../../types";
import Page from "../../layouts/page";
import UserFollowers from "./followers";
import Banner from "../../layouts/banner";
import { createCatalogImageURL } from "../../helpers";
import { useQuery, useToggleUserFollowing } from "../../hooks";

import GET_USER_PAGE from "./get-user-page.gql";

const UserPageHome: FC = () => <p className="ParagraphOne">W.I.P.</p>;

const UserPage: FC = () => {
	const params = useParams<keyof UserID>();
	const userID = addDashesToUUID(params.userID!);

	const { data, error } = useQuery<GetUserPageData, UserID>(GET_USER_PAGE, {
		variables: { userID },
	});

	const [toggleUserFollowing, isFollowing, isUser] = useToggleUserFollowing({ userID });

	if (error) {
		return (
			<Page>
				<h2 className="Content ParagraphOne PaddingTopBottom">
					{error.message === "Failed to fetch" ? error.message : "User does not exist."}
				</h2>
			</Page>
		);
	}

	const dateJoined = data ? new Date(data.getUserByID.dateJoined).toLocaleDateString() : "";

	if (data) {
		return (
			<Head pageTitle={data.getUserByID.name}>
				<Page>
					<Banner
						title={<Link to="">{data.getUserByID.name}</Link>}
						subTitle={
							!isUser && data.getUserByID.isFollower
								? `${dateJoined} - Follows you`
								: `${dateJoined}`
						}
						buttons={
							<Fragment>
								{isUser ? (
									<Link to="/manage-account">
										<Button text="Manage" title="Manage Account" icon="manage_accounts" />
									</Link>
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
											style={
												isActive
													? {
															backgroundColor: "var(--primary-color-dark)",
													  }
													: undefined
											}
										/>
									)}
								</NavLink>
							</Fragment>
						}
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
					<div className="ContentPaddingTopBottom">
						<Routes>
							<Route path="" key="home" element={<UserPageHome />} />
							<Route key="followers" path="followers" element={<UserFollowers />} />
						</Routes>
					</div>
				</Page>
			</Head>
		);
	} else {
		return <Page />;
	}
};

interface GetUserPageData {
	getUserByID: User;
}

export default UserPage;
