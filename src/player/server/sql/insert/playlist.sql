INSERT INTO playlists (
	title,
	user_id,
	is_public,
	playlist_id
) VALUES (
	{{ title }},
	'{{ userID }}',
	{{ isPublic }},
	'{{ playlistID }}'
) RETURNING
	{{ columnNames }};