SELECT
	{{ columnNames }}
FROM
	now_playing
WHERE
	user_id = {{ userID }};