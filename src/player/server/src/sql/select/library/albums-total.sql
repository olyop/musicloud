SELECT
	count(*)
FROM
	albums
WHERE
	album_id in(
		SELECT
			songs.album_id
		FROM
			library_songs
		JOIN
			songs
				ON library_songs.song_id = songs.song_id
		WHERE
			user_id = '{{ userID }}'
	);