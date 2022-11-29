SELECT
	{{ columnNames }}
FROM
	users_followers
JOIN
	users
		ON users_followers.follower_user_id = users.user_id
WHERE
	users_followers.user_id = {{ userID }};