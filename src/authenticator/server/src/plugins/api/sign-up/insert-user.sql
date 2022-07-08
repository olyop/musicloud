INSERT INTO users (
	name,
	password,
	email_address
) VALUES (
	{{ name }},
	{{ password }},
	{{ emailAddress }}
) RETURNING
	{{ columnNames }};