INSERT INTO users_followers (
	user_id,
	follower_user_id
) VALUES (
	{{ userID }},
	{{ followerUserID }}
);