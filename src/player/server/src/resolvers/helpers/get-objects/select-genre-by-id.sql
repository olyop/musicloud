SELECT
	{{ columnNames }}
FROM
	genres
WHERE
	genre_id = {{ genreID }};