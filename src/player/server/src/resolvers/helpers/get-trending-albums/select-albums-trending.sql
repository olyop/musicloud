SELECT
	{{ columnNames }}
FROM
	albums
WHERE
	released > (CURRENT_DATE - INTERVAL '2' year)
LIMIT
	{{ limit }};