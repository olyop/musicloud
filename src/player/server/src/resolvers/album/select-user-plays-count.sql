SELECT
	count(*)
FROM
	plays
WHERE
	user_id = {{ userID }} AND
	song_id IN(
		SELECT
			song_id
		FROM
			songs
		WHERE
			album_id = {{ albumID }}
	);