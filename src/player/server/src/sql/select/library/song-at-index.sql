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
	in_library = true AND
	user_id = '{{ userID }}'
ORDER BY
	{{ orderByField }} {{ orderByDirection }},
	songs.album_id ASC,
	songs.disc_number ASC,
	songs.track_number ASC
LIMIT
	1
OFFSET
	{{ atIndex }};