import isEmpty from "lodash-es/isEmpty";
import { useParams } from "react-router-dom";
import { createElement, Fragment, FC } from "react";
import { addDashesToUUID } from "@oly_op/uuid-dashes";
import { UserID } from "@oly_op/musicloud-common/build/types";

import { useQuery } from "../../hooks";
import User from "../../components/user";
import { User as UserType } from "../../types";
import { determinePlural } from "../../helpers";

import GET_USER_FOLLOWERS from "./get-user-followers.gql";

const UserFollowers: FC = () => {
	const params = useParams<keyof UserID>();
	const userID = addDashesToUUID(params.userID!);

	const { data } = useQuery<QueryData, UserID>(GET_USER_FOLLOWERS, {
		variables: { userID },
	});

	return (
		<div className="FlexColumnGapHalf">
			<h2 className="HeadingFive">Followers</h2>
			{data?.getUserByID.followers &&
				(isEmpty(data.getUserByID.followers) ? (
					<p className="ParagraphTwo">No followers.</p>
				) : (
					<Fragment>
						<p className="ParagraphTwo">
							{data.getUserByID.followers.length}
							<Fragment> follower</Fragment>
							{determinePlural(data.getUserByID.followers.length)}
						</p>
						<div className="Elevated">
							{data.getUserByID.followers.map(follower => (
								<User user={follower} key={follower.userID} />
							))}
						</div>
					</Fragment>
				))}
		</div>
	);
};

interface QueryData {
	getUserByID: UserType;
}

export default UserFollowers;
