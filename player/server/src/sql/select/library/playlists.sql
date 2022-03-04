SELECT
	{{ columnNames }}
FROM
	library_playlists
JOIN
	playlists
		ON library_playlists.playlist_id = playlists.playlist_id
WHERE
	in_library = true AND
	library_playlists.user_id = '{{ userID }}';