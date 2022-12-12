SELECT
	playlists_songs.index,
	playlists_songs.date_added
FROM
	playlists_songs
WHERE
	song_id = {{ songID }} AND
	playlist_id = {{ playlistID }};