SELECT
	name,
	password
FROM
	users
WHERE
	user_id = '{{ userID }}';