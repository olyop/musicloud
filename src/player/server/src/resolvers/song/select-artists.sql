SELECT
	{{ columnNames }}
FROM
	songs_artists
JOIN
	artists
		ON songs_artists.artist_id = artists.artist_id
WHERE
	song_id = {{ songID }}
ORDER BY
	index ASC;