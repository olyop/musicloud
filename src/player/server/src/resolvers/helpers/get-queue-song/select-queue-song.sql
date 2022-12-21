SELECT
	{{ columnNames }}
FROM
	{{ tableName }}
WHERE
	index = {{ index }} AND
	user_id = {{ userID }}
ORDER BY
	index ASC
LIMIT
	1;