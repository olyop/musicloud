SELECT
	sum(duration)
FROM
	songs
WHERE
	album_id = {{ albumID }};