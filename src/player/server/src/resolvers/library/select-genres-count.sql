SELECT
	count(*)
FROM
	genres
WHERE
	genre_id in(
		SELECT
			genre_id
		FROM
			songs_genres
		WHERE
			song_id in(
				SELECT
					song_id
				FROM
					library_songs
				WHERE
					user_id = {{ userID }}
			)
	);