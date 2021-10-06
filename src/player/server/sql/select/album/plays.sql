SELECT
	{{ columnNames }}
FROM
	plays
WHERE
	song_id in(
		SELECT
			song_id
		FROM
			songs
		WHERE
			album_id = '{{ albumID }}'
	);