SELECT
	count(*)
FROM
	plays
WHERE
	song_id = {{ songID }};