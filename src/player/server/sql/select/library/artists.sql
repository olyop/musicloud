SELECT
	{{ columnNames }}
FROM
	library_artists
JOIN
	artists
		ON library_artists.artist_id = artists.artist_id
WHERE
	in_library = true AND
	user_id = '{{ userID }}';