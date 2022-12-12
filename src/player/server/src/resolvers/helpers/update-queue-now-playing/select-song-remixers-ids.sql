SELECT
	artists.artist_id
FROM
	songs_remixers
JOIN
	artists
		ON songs_remixers.artist_id = artists.artist_id
WHERE
	songs_remixers.song_id = {{ songID }};