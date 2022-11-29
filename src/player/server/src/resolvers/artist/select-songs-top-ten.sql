SELECT
	{{ columnNames }},
	COUNT(plays.song_id) as sum
FROM
	get_artist_song_ids({{ artistID }}) AS artist_songs_ids
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