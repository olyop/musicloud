SELECT
	count(*)
FROM
	plays
WHERE
	user_id = {{ userID }};