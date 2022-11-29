SELECT
	song_id
FROM
	songs
WHERE
	album_id = {{ albumID }};