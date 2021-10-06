SELECT
	{{ columnNames }}
FROM
	library_songs
JOIN
	songs
		ON library_songs.song_id = songs.song_id
WHERE
	in_library = true AND
	user_id = '{{ userID }}';