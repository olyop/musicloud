DELETE FROM
	playlists_songs
WHERE
	index = {{ index }} AND
	playlist_id = {{ playlistID }};