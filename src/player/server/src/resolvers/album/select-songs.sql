SELECT
	{{ columnNames }}
FROM
	songs
WHERE
	album_id = {{ albumID }}
ORDER BY
	disc_number ASC,
	track_number ASC;