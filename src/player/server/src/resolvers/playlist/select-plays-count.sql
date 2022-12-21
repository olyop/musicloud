SELECT
	count(*)
FROM
	plays
WHERE
	song_id IN(
		SELECT
			songs.song_id
		FROM
			playlists_songs
		JOIN
			songs
				ON playlists_songs.song_id = songs.song_id
		WHERE
			playlist_id = {{ playlistID }}
	);