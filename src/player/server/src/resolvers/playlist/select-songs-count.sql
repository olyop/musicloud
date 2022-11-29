SELECT
	count(*)
FROM
	playlists_songs
WHERE
	playlist_id = {{ playlistID }};