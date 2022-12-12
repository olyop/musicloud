SELECT
	count(*)
FROM
	plays
WHERE
	user_id = {{ userID }} AND
	song_id IN(
		SELECT
			songs.song_id
		FROM
			songs_genres
		JOIN
			songs
				ON songs_genres.song_id = songs.song_id
		WHERE
			songs_genres.genre_id = {{ genreID }};
	);