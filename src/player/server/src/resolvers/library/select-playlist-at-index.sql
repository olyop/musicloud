SELECT
	{{ columnNames }}
FROM
	library_playlists
JOIN
	playlists
		ON library_playlists.playlist_id = playlists.playlist_id
WHERE
	library_playlists.user_id = {{ userID }}
ORDER BY
	{{ orderByField }} {{ orderByDirection }}
OFFSET
	{{ atIndex }}
FETCH
	FIRST ROW ONLY;