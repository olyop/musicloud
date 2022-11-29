SELECT
	{{ columnNames }}
FROM
	plays
WHERE
	play_id = {{ playID }};