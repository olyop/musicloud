INSERT INTO users (
	name,
	user_id,
	password
) VALUES (
	{{ name }},
	'{{ userID }}',
	{{ password }}
) RETURNING
	name,
	user_id,
	date_joined;