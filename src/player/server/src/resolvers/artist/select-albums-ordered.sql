SELECT
	{{ columnNames }}
FROM
	get_artist_album_ids({{ artistID }}) AS artist_albums_ids
JOIN
	 albums
		ON artist_albums_ids.album_id = albums.album_id
ORDER BY
	albums.{{ orderByField }} {{ orderByDirection }};