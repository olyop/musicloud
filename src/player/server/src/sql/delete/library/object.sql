DELETE FROM
	{{ tableName }}
WHERE
	user_id = {{ userID }} AND
	{{ columnName }} = {{ objectID }}