SELECT
	artist_id
FROM
	songs_artists
WHERE
	song_id = {{ songID }};