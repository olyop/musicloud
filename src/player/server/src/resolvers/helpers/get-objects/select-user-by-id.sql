SELECT
	{{ columnNames }}
FROM
	users
WHERE
	user_id = {{ userID }};