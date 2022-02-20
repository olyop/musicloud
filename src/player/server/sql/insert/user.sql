INSERT INTO users (
	name,
	email,
	password,
	emailAddress
) VALUES (
	{{ name }},
	{{ email }},
	{{ password }},
	{{ emailAddress }}
) RETURNING
	user_id;