SELECT
	{{ columnNames }}
FROM
	songs_genres
JOIN
	genres
		ON songs_genres.genre_id = genres.genre_id
WHERE
	song_id = {{ songID }}
ORDER BY
	index;