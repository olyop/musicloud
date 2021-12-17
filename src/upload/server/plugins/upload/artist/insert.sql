INSERT INTO artists (
	name,
	city,
	country
) VALUES (
	{{ name }},
	{{ city }},
	{{ country }}
) RETURNING
	artist_id;