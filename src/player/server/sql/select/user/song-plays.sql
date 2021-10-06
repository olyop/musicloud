SELECT
	{{ columnNames }}
FROM
	plays
WHERE
	user_id = '{{ userID }}' AND
	song_id = '{{ songID }}';