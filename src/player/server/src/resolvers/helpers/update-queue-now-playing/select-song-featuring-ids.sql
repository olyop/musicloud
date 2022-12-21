SELECT
	artist_id
FROM
	songs_featurings
WHERE
	song_id = {{ songID }};