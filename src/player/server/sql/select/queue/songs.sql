SELECT
	{{ columnNames }}
FROM
	{{ tableName }}
JOIN
	songs
		ON {{ tableName }}.song_id = songs.song_id
WHERE
	{{ tableName }}.user_id = '{{ userID }}'
ORDER BY
	{{ tableName }}.index ASC
LIMIT
	50;