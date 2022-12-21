UPDATE
	{{ tableName }}
SET
	index = index {{ crement }} 1
WHERE
	index = {{ index }} AND
	user_id = {{ userID }};