INSERT INTO playlists (
	title,
	user_id,
	playlist_id
) VALUES (
	{{ title }},
	'{{ userID }}',
	'{{ playlistID }}'
) RETURNING
	{{ columnNames }};