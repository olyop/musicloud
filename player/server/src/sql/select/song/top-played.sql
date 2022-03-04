SELECT
	{{ columnNames }},
	COUNT(plays.song_id) as sum
FROM
	songs
JOIN
	plays
		ON songs.song_id = plays.song_id
GROUP BY
	songs.song_id
ORDER BY
	sum DESC
LIMIT
	{{ limit }};