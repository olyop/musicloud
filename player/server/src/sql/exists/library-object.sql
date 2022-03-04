SELECT EXISTS (
	SELECT
		*
	FROM
		{{ tableName }}
	WHERE
		user_id = '{{ userID }}' AND
		{{ columnName }} = '{{ objectID }}'
);