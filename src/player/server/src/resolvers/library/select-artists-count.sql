SELECT
	count(*)
FROM
	library_artists
JOIN
	artists
		ON library_artists.artist_id = artists.artist_id
WHERE
	user_id = {{ userID }};