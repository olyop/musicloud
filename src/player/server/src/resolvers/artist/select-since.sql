SELECT DISTINCT
	released
FROM
	get_artist_album_ids({{ albumID }}) AS artist_albums_ids
JOIN
	 albums
		ON artist_albums_ids.album_id = albums.album_id
ORDER BY
	albums.released ASC
LIMIT
	1;