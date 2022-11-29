SELECT
	{{ columnNames }}
FROM
	library_artists
JOIN
	artists
		ON library_artists.artist_id = artists.artist_id
WHERE
	library_artists.user_id = {{ userID }}
ORDER BY
	{{ orderByTableName }}.{{ orderByField }} {{ orderByDirection }}
LIMIT
	1
OFFSET
	{{ atIndex }};