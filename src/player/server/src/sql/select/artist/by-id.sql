SELECT
	{{ columnNames }}
FROM
	artists
WHERE
	artist_id = '{{ artistID }}';