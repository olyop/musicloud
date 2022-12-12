SELECT
	artists.artist_id
FROM
	songs_featurings
JOIN
	artists
		ON songs_featurings.artist_id = artists.artist_id
WHERE
	songs_featurings.song_id = {{ songID }};