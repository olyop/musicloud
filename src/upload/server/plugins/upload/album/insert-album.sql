INSERT INTO albums (
	title,
	album_id,
	released
) VALUES (
	{{ title }},
	'{{ albumID }}',
	'{{ released }}'
) RETURNING
	*;