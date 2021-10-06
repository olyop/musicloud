SELECT
	{{ columnNames }}
FROM
	albums
WHERE
	released > (CURRENT_DATE - INTERVAL '365' day)
LIMIT
	10;