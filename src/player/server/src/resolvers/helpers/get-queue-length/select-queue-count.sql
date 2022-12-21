SELECT
	count(*)
FROM
	{{ tableName }}
WHERE
	user_id = {{ userID }};