SELECT
	count(*)
FROM
	(
		SELECT DISTINCT
			songs.song_id
		FROM
			get_artist_song_ids({{ artistID }}) AS artist_songs_ids
		JOIN
			songs
				ON artist_songs_ids.song_id = songs.song_id
	) AS artist_songs
JOIN
	plays
		ON plays.song_id = artist_songs.song_id;