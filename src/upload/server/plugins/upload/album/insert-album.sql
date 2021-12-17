INSERT INTO albums (
	title,
	released
) VALUES (
	{{ title }},
	'{{ released }}'
) RETURNING
	album_id;