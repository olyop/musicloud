SELECT
	{{ columnNames }}
FROM
	{{ tableName }}
WHERE
	user_id = {{ userID }}
ORDER BY
	index ASC;