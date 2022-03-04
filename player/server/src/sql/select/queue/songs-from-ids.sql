SELECT
	{{ columnNames }}
FROM
	songs
JOIN
	{{ tableName }}
		ON {{ tableName }}.song_id = songs.song_id
WHERE
	songs.song_id in({{ songIDs }})
ORDER BY
	{{ tableName }}.index;