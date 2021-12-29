INSERT INTO playlists_songs (
	index,
	song_id,
	playlist_id
) VALUES (
	{{ index }},
	'{{ songID }}',
	'{{ playlistID }}'
);