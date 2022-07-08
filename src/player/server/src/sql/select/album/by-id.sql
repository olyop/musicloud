SELECT
	{{ columnNames }}
FROM
	albums
WHERE
	album_id = '{{ albumID }}'