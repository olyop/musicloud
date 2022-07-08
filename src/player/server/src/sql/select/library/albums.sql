SELECT
	count(*)
FROM
	albums
WHERE
	album_id in(
		SELECT
			albums.album_id
		FROM
			library_albums
		JOIN
			albums
				ON library_albums.song_id = albums.album_id
		WHERE
			in_library = true AND
			user_id = '{{ userID }}'
	);