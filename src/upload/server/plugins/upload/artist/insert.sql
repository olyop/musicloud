INSERT INTO artists (
	name,
	city,
	country,
	artist_id
) VALUES (
	{{ name }},
	{{ city }},
	{{ country }},
	'{{ artistID }}'
) RETURNING
	*;