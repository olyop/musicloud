SELECT
	{{ columnNames }}
FROM
	plays
WHERE
	song_id = '{{ songID }}';