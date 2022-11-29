SELECT
	{{ columnNames }}
FROM
	songs_genres
JOIN
	songs
		ON songs_genres.song_id = songs.song_id
JOIN
	albums
		ON songs.album_id = albums.album_id
WHERE
	songs_genres.genre_id = {{ genreID }}
ORDER BY
	{{ orderByField }} {{ orderByDirection }},
	songs.album_id ASC,
	songs.disc_number ASC,
	songs.track_number ASC;