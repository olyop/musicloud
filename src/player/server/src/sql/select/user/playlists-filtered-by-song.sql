SELECT
	{{ columnNames }}
FROM
	library_playlists
JOIN
	playlists
		ON playlists.user_id = '{{ userID }}' AND
			 library_playlists.playlist_id = playlists.playlist_id
WHERE
	library_playlists.user_id = '{{ userID }}' AND
	NOT EXISTS (
		SELECT
			*
		FROM
			playlists_songs
		WHERE
			song_id = '{{ songID }}' AND
			playlist_id = library_playlists.playlist_id
	);