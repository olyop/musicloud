INSERT INTO users (
	name,
	password
) VALUES (
	{{ name }},
	{{ password }}
) RETURNING
	user_id;