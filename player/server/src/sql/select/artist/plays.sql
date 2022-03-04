SELECT
	plays.play_id
FROM
	(
		SELECT DISTINCT
			songs.song_id
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
	) AS artist_songs
JOIN
	plays
		ON plays.song_id = artist_songs.song_id;