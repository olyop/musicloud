INSERT INTO genres (
	name
) VALUES (
	{{ name }}
) RETURNING
	genre_id;