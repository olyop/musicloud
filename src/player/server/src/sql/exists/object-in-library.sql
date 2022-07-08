SELECT EXISTS (
	SELECT
		*
	FROM
		{{ tableName }}
	WHERE
		in_library = true AND
		user_id = '{{ userID }}' AND
		{{ columnName }} = '{{ objectID }}'
);