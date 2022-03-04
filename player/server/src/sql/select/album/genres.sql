SELECT DISTINCT
	{{ columnNames }}
FROM
	songs_genres
JOIN
	genres
		ON songs_genres.genre_id = genres.genre_id
WHERE
	song_id in(
		SELECT
			song_id
		FROM
			songs
		WHERE
			album_id = '{{ albumID }}'
	)
ORDER BY
	genres.name ASC;