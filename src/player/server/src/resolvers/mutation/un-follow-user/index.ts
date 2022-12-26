import { UserID } from "@oly_op/musicloud-common/build/types";
import { getResultExists, importSQL, query } from "@oly_op/pg-helpers";

import { User } from "../../../types/index.js";
import { getUser } from "../../helpers/index.js";
import resolver from "../resolver.js";

const isf = importSQL(import.meta.url);

const EXISTS_USER_FOLLOWER = await isf("exists-user-follower");
const DELETE_USER_FOLLOWER = await isf("delete-user-follower");

export const unFollowUser = resolver<User, UserID>(async ({ args, context }) => {
	const { userID } = args;
	const followerUserID = context.getAuthorizationJWTPayload(context.authorization).userID;

	if (userID === followerUserID) {
		throw new Error("Cannot unfollow yourself");
	}

	const isFollowing = await query(context.pg)(EXISTS_USER_FOLLOWER)({
		parse: getResultExists,
		variables: { userID, followerUserID },
	});

	if (isFollowing) {
		await query(context.pg)(DELETE_USER_FOLLOWER)({
			variables: { userID, followerUserID },
		});
	}

	return getUser(context.pg)(args);
});
