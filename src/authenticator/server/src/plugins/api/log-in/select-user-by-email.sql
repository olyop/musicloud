SELECT
	{{ columnNames }}
FROM
	users
WHERE
	email_address = {{ emailAddress }};