SELECT
	artists.artist_id
FROM
	songs_artists
JOIN
	artists
		ON songs_artists.artist_id = artists.artist_id
WHERE
	songs_artists.song_id = {{ songID }};