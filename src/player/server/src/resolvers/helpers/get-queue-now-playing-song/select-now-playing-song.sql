SELECT
	{{ columnNames }}
FROM
	now_playing
JOIN
	songs ON
		songs.song_id = now_playing.song_id
WHERE
	user_id = {{ userID }};