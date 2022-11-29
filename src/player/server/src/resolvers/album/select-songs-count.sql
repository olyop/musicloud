SELECT
	count(*)
FROM
	songs
WHERE
	album_id = {{ albumID }};