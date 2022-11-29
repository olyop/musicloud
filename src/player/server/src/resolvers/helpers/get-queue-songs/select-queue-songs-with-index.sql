SELECT
	{{ columnNames }},
	{{ tableName }}.index as queue_index
FROM
	{{ tableName }}
JOIN
	songs
		ON {{ tableName }}.song_id = songs.song_id
WHERE
	{{ tableName }}.user_id = {{ userID }}
ORDER BY
	{{ tableName }}.index ASC
LIMIT
	{{ limit }};