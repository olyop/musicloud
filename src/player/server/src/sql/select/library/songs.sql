SELECT
	{{ columnNames }}
FROM
	library_songs
JOIN
	songs
		ON library_songs.song_id = songs.song_id
JOIN
	albums
		ON songs.album_id = albums.album_id
WHERE
	user_id = '{{ userID }}'
ORDER BY
	library_songs.date_added DESC,
	songs.album_id ASC,
	songs.disc_number ASC,
	songs.track_number ASC;