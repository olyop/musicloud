SELECT
	{{ columnNames }}
FROM
	now_playing
JOIN
	songs ON
		songs.song_id = now_playing.song_id
WHERE
	now_playing.user_id = {{ userID }};