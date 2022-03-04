SELECT EXISTS (
	SELECT
		*
	FROM
		{{ tableName }}
	WHERE
		index = {{ index }} AND
		user_id = '{{ userID }}'
);