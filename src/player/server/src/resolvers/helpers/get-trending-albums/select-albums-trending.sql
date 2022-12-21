SELECT
	{{ columnNames }}
FROM
	albums
WHERE
	released > (get_now() - 86400 * 265 * 2)
LIMIT
	{{ limit }};