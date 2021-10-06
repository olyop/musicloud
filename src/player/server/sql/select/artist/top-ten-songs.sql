SELECT
	{{ columnNames }},
	COUNT(plays.song_id) as sum
FROM
	(
		SELECT
			song_id
		FROM
			songs_artists
		WHERE
			artist_id = '{{ artistID }}'
		UNION
		SELECT
			song_id
		FROM
			songs_remixers
		WHERE
			artist_id = '{{ artistID }}'
		UNION
		SELECT
			song_id
		FROM
			songs_featurings
		WHERE
			artist_id = '{{ artistID }}'
	) AS artist_songs_ids
JOIN
	songs
		ON artist_songs_ids.song_id = songs.song_id
JOIN
	plays
		ON artist_songs_ids.song_id = plays.song_id
GROUP BY
	songs.song_id
ORDER BY
	sum DESC
LIMIT
	10;