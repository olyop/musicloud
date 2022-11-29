SELECT
	{{ columnNames }}
FROM
	playlists
WHERE
	playlist_id = {{ playlistID }};