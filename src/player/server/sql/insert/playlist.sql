INSERT INTO playlists (
	title,
	user_id,
	privacy
) VALUES (
	{{ title }},
	'{{ userID }}',
	'{{ privacy }}'
) RETURNING
	{{ columnNames }};