SELECT
	count(*)
FROM
	plays
WHERE
	song_id IN(
		SELECT
			song_id
		FROM
			songs
		WHERE
			album_id = {{ albumID }}
	);