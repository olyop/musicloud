DELETE FROM
	users_followers
WHERE
	user_id = '{{ userID }}' AND
	follower_user_id = '{{ followerUserID }}';