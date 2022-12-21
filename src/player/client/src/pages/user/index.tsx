import { ImageDimensions, ImageSizes, UserID } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { FC, Fragment, createElement } from "react";
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";

import { createCatalogImageURL, formatTimestamp } from "../../helpers";
import { useJWTPayload, useQuery, useToggleUserFollowing } from "../../hooks";
import Banner from "../../layouts/banner";
import Page from "../../layouts/page";
import { User } from "../../types";
import UserFollowers from "./followers";
import GET_USER_PAGE from "./get-user-page.gql";

const UserPageHome: FC = () => <p className="ParagraphOne">W.I.P.</p>;

const UserPage: FC = () => {
	const token = useJWTPayload();
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

	if (data) {
		const dateJoined = formatTimestamp(data.getUserByID.dateJoined);
		const isOwnPage = data.getUserByID.userID === token.userID;
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
								{isOwnPage || (
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
