SELECT
	artist_id
FROM
	songs_remixers
WHERE
	song_id = {{ songID }};