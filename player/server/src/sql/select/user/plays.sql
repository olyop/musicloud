SELECT
	{{ columnNames }}
FROM
	plays
WHERE
	user_id = '{{ userID }}';