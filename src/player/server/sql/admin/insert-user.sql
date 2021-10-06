INSERT INTO users (
	name,
	email,
	user_id,
	name_vector
) VALUES (
	{{ name }},
	{{ email }},
	'{{ userID }}',
	to_tsvector({{ name }})
) RETURNING
	{{ columnNames }};