SELECT
	{{ columnNames }}
FROM
	library_playlists
JOIN
	playlists
		ON library_playlists.playlist_id = songs.playlist_id
WHERE
	in_library = true AND
	user_id = '{{ userID }}'
ORDER BY
	{{ orderByField }} {{ orderByDirection }}
LIMIT
	1
OFFSET
	{{ atIndex }};