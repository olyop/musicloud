SELECT
	count(*)
FROM
	library_songs
WHERE
	user_id = {{ userID }};