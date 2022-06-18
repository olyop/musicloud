SELECT
	{{ columnNames }}
FROM
	albums
WHERE
	album_id in(
		SELECT
			albums.album_id
		FROM
			library_albums
		JOIN
			songs
				ON library_albums.song_id = albums.album_id
		WHERE
			in_library = true AND
			user_id = '{{ userID }}'
		ORDER BY
			{{ orderByField }} {{ orderByDirection }}
		LIMIT
			1
		OFFSET
			{{ atIndex }}
	);