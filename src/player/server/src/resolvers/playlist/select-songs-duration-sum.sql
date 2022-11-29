SELECT
	sum(songs.duration)
FROM
	playlists_songs
JOIN
	songs
		ON playlists_songs.song_id = songs.song_id
WHERE
	playlist_id = {{ playlistID }};