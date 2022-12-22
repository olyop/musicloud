import { UserID } from "@oly_op/musicloud-common/build/types";
import isUndefined from "lodash-es/isUndefined";

import { User } from "../../types";
import { useJWTPayload } from "../jwt-payload";
import { useMutation } from "../mutation";
import { useQuery } from "../query";
import FOLLOW_USER from "./follow-user.gql";
import GET_USER_FOLLOWING from "./get-user-following.gql";
import UN_FOLLOW_USER from "./un-follow-user.gql";

export const useToggleUserFollowing = ({ userID }: UserID) => {
	const { userID: ownUserID } = useJWTPayload();

	const { data } = useQuery<GetUserFollowingData, UserID>(GET_USER_FOLLOWING, {
		variables: { userID },
	});

	const [followUser] = useMutation<unknown, UserID>(FOLLOW_USER, {
		variables: { userID },
	});

	const [unFollowUser] = useMutation<unknown, UserID>(UN_FOLLOW_USER, {
		variables: { userID },
	});

	const isUser = userID === ownUserID;

	const isFollowing = isUser ? false : isUndefined(data) ? false : data.getUserByID.isFollowing;

	const handler = () => {
		if (isFollowing) {
			void unFollowUser();
		} else {
			void followUser();
		}
	};

	return [handler, isFollowing, isUser] as const;
};

interface GetUserFollowingData {
	getUserByID: User;
}
